import {
  AerodromeSwapProofResult,
  AerodromeSwapRoute,
  Note,
  PartialNote,
  createPartialNote,
  generateAerodromeSwapProof,
  recoverNoteWithFooter
} from '@thesingularitynetwork/darkpool-v1-proof';
import AerodromeSwapAssetManagerAbi from '../../abis/AerodromeSwapAssetManager.json';
import { Action, relayerPathConfig } from '../../config/config';
import { Token } from '../../entities/token';
import { hexlify32, isAddressEquals } from '../../utils/util';
import { BaseRelayerContext, BaseRelayerService, SingleNoteResult } from '../BaseService';
import { getMerklePathAndRoot } from '../merkletree';
import { Relayer } from '../../entities/relayer';
import { AerodromeSwapRelayerRequest, DarkpoolError } from '../../entities';
import { DarkPool } from '../../darkpool';
import { getOutEvent } from '../EventService';

export interface AerodromeSwapRequest {
  inNote: Note;
  outAsset: Token;
  minExpectedOutAmount: bigint;
  deadline: number;
  routes: AerodromeSwapRoute[];
  gasRefundInOutToken: bigint;
}

class AerodromeSwapContext extends BaseRelayerContext {
  private _request?: AerodromeSwapRequest;
  private _proof?: AerodromeSwapProofResult;
  private _outPartialNote?: PartialNote;

  constructor(relayer: Relayer, signature: string) {
    super(relayer, signature);
  }

  set request(request: AerodromeSwapRequest | undefined) {
    this._request = request;
  }

  get request(): AerodromeSwapRequest | undefined {
    return this._request;
  }

  set proof(proof: AerodromeSwapProofResult | undefined) {
    this._proof = proof;
  }

  get proof(): AerodromeSwapProofResult | undefined {
    return this._proof;
  }

  set outPartialNote(outPartialNote: PartialNote | undefined) {
    this._outPartialNote = outPartialNote;
  }

  get outPartialNote(): PartialNote | undefined {
    return this._outPartialNote;
  }
}

export class AerodromeSwapService extends BaseRelayerService<
  AerodromeSwapContext,
  AerodromeSwapRelayerRequest,
  SingleNoteResult
> {
  constructor(_darkPool: DarkPool) {
    super(_darkPool);
  }

  public async prepare(
    request: AerodromeSwapRequest,
    signature: string
  ): Promise<{ context: AerodromeSwapContext; outPartialNotes: PartialNote[] }> {
    const outPartialNote = await createPartialNote(request.outAsset.address, signature);
    const context = new AerodromeSwapContext(this._darkPool.getRelayer(), signature);
    context.request = request;
    context.outPartialNote = outPartialNote;
    return { context, outPartialNotes: [outPartialNote] };
  }

  public async generateProof(context: AerodromeSwapContext): Promise<void> {
    if (!context || !context.request || !context.outPartialNote || !context.signature) {
      throw new DarkpoolError('Invalid context');
    }

    const path = await getMerklePathAndRoot(context.request.inNote.note, this._darkPool);

    const proof = await generateAerodromeSwapProof({
      inNote: context.request.inNote,
      merkleRoot: path.root,
      inNoteMerklePath: path.path,
      inNoteMerkleIndex: path.index,
      routes: context.request.routes,
      minOutAmount: context.request.minExpectedOutAmount,
      outNotePartial: context.outPartialNote,
      deadline: context.request.deadline,
      relayer: context.relayer.relayerAddress,
      signedMessage: context.signature,
      options: this._darkPool.proofOptions
    });
    context.merkleRoot = path.root;
    context.proof = proof;
  }

  protected async getRelayerRequest(context: AerodromeSwapContext): Promise<AerodromeSwapRelayerRequest> {
    if (
      !context ||
      !context.request ||
      !context.outPartialNote ||
      !context.signature ||
      !context.merkleRoot ||
      !context.proof
    ) {
      throw new DarkpoolError('Invalid context');
    }

    const swapRelayerRequest: AerodromeSwapRelayerRequest = {
      proof: context.proof.proof.proof,
      merkleRoot: context.merkleRoot,
      inNullifier: hexlify32(context.proof.inNoteNullifier),
      inAsset: context.request.inNote.asset,
      inAmount: hexlify32(context.request.inNote.amount),
      routes: context.request.routes,
      routeHash: context.proof.routeHash,
      minExpectedAmountOut: hexlify32(context.request.minExpectedOutAmount),
      deadline: hexlify32(context.request.deadline),
      outNoteFooter: hexlify32(context.outPartialNote.footer),
      gasRefund: hexlify32(context.request.gasRefundInOutToken),
      relayer: context.relayer.relayerAddress,
      verifierArgs: context.proof.proof.verifyInputs
    };

    return swapRelayerRequest;
  }

  protected getRelayerPath(): string {
    return relayerPathConfig[Action.AERODROME_SWAP];
  }

  protected async postExecute(context: AerodromeSwapContext): Promise<SingleNoteResult> {
    if (
      !context ||
      !context.request ||
      !context.tx ||
      !context.outPartialNote ||
      !context.signature ||
      !context.merkleRoot ||
      !context.proof
    ) {
      throw new DarkpoolError('Invalid context');
    }

    if (!context.tx) {
      throw new DarkpoolError('No transaction hash');
    }

    const event = await getOutEvent(context.tx, AerodromeSwapAssetManagerAbi.abi, 'AerodromeSwap', this._darkPool);

    if (!event || !event.args || !event.args[2]) {
      throw new DarkpoolError('Can not find AerodromeSwap Event from transaction: ' + context.tx);
    }

    const amountOut = event.args[2];

    let processedOutAsset = context.request.outAsset.address;
    if (isAddressEquals(context.request.outAsset.address, this._darkPool.contracts.nativeWrapper)) {
      processedOutAsset = this._darkPool.contracts.ethAddress;
    }

    const outNote = await recoverNoteWithFooter(
      context.outPartialNote.rho,
      processedOutAsset,
      BigInt(amountOut),
      context.signature
    );

    return { note: outNote, txHash: context.tx };
  }
}
