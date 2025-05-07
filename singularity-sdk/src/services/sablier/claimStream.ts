import {
  NftNote,
  PartialNote,
  SablierClaimProofResult,
  UniswapSingleSwapProofResult,
  createPartialNote,
  generateSablierClaimProof,
  recoverNoteWithFooter
} from '@thesingularitynetwork/darkpool-v1-proof';

import { Action, relayerPathConfig } from '../../config/config';
import { ClaimStreamSablierRelayerRequest } from '../../entities/relayerRequestTypes';
import { Token } from '../../entities/token';
import { hexlify32 } from '../../utils/util';
import { BaseRelayerContext, BaseRelayerService, SingleNoteResult } from '../BaseService';
import { getMerklePathAndRoot } from '../merkletree';
import { Relayer } from '../../entities/relayer';
import { DarkpoolError } from '../../entities';
import { DarkPool } from '../../darkpool';
import { getOutEvent } from '../EventService';
import SablierLinearAssetManagerAbi from '../../abis/SablierLinearAssetManager.json';
class ClaimStreamSablierContext extends BaseRelayerContext {
  private _proof?: SablierClaimProofResult;
  private _outPartialNote?: PartialNote;
  private _inNote?: NftNote;
  private _amountOut?: bigint;

  constructor(relayer: Relayer, signature: string) {
    super(relayer, signature);
  }

  set proof(proof: UniswapSingleSwapProofResult | undefined) {
    this._proof = proof;
  }

  get proof(): UniswapSingleSwapProofResult | undefined {
    return this._proof;
  }

  set outPartialNote(outPartialNote: PartialNote | undefined) {
    this._outPartialNote = outPartialNote;
  }

  get outPartialNote(): PartialNote | undefined {
    return this._outPartialNote;
  }

  set inNote(inNote: NftNote | undefined) {
    this._inNote = inNote;
  }

  get inNote(): NftNote | undefined {
    return this._inNote;
  }

  set amountOut(amountOut: bigint | undefined) {
    this._amountOut = amountOut;
  }

  get amountOut(): bigint | undefined {
    return this._amountOut;
  }
}

export class ClaimStreamSablierService extends BaseRelayerService<
  ClaimStreamSablierContext,
  ClaimStreamSablierRelayerRequest,
  SingleNoteResult
> {
  constructor(_darkPool: DarkPool) {
    super(_darkPool);
  }

  public async prepare(
    inNote: NftNote,
    outAsset: Token,
    amountOut: bigint,
    signature: string
  ): Promise<{ context: ClaimStreamSablierContext; outPartialNotes: PartialNote[] }> {
    const outPartialNote = await createPartialNote(outAsset.address, signature);
    const context = new ClaimStreamSablierContext(this._darkPool.getRelayer(), signature);
    context.inNote = inNote;
    context.outPartialNote = outPartialNote;
    context.amountOut = amountOut;
    return { context, outPartialNotes: [outPartialNote] };
  }

  public async generateProof(context: ClaimStreamSablierContext): Promise<void> {
    if (!context || !context.outPartialNote || !context.signature || !context.inNote || !context.amountOut) {
      throw new DarkpoolError('Invalid context');
    }

    const path = await getMerklePathAndRoot(context.inNote.note, this._darkPool);

    const proof = await generateSablierClaimProof({
      merkleRoot: path.root,
      merkleIndex: path.index,
      merklePath: path.path,
      inNote: context.inNote,
      outNotePartial: context.outPartialNote,
      signedMessage: context.signature,
      outAmount: context.amountOut,
      relayer: context.relayer.relayerAddress
    });
    context.proof = proof;
    context.merkleRoot = path.root;
  }

  protected async getRelayerRequest(context: ClaimStreamSablierContext): Promise<ClaimStreamSablierRelayerRequest> {
    if (
      !context ||
      !context.outPartialNote ||
      !context.signature ||
      !context.merkleRoot ||
      !context.proof ||
      !context.inNote ||
      !context.amountOut
    ) {
      throw new DarkpoolError('Invalid context');
    }

    const claimStreamSablierRelayerRequest: ClaimStreamSablierRelayerRequest = {
      proof: context.proof.proof.proof,
      merkleRoot: context.merkleRoot,
      assetOut: context.outPartialNote.asset,
      amountOut: hexlify32(context.amountOut),
      nullifier: context.proof.inNullifier,
      noteFooterOut: hexlify32(context.outPartialNote.footer),
      relayer: context.relayer.relayerAddress,
      refund: hexlify32(0n),
      verifierArgs: context.proof.proof.verifyInputs,
      stream: context.inNote.address,
      streamId: hexlify32(context.inNote.tokenId)
    };

    return claimStreamSablierRelayerRequest;
  }

  protected getRelayerPath(): string {
    return relayerPathConfig[Action.SABLIER_CLAIM_STREAM];
  }

  public async postExecute(context: ClaimStreamSablierContext): Promise<SingleNoteResult> {
    if (!context || !context.tx || !context.outPartialNote || !context.signature || !context.proof) {
      throw new DarkpoolError('Invalid context');
    }

    const event = await getOutEvent(context.tx, SablierLinearAssetManagerAbi.abi, 'SablierClaimStream', this._darkPool);
    if (!event || !event.args || !event.args[2]) {
      throw new DarkpoolError('Failed to find the SablierClaimStream event in the transaction receipt.');
    }

    const outAmount = event.args[2];
    const outNote = await recoverNoteWithFooter(
      context.outPartialNote.rho,
      context.outPartialNote.asset,
      BigInt(outAmount),
      context.signature
    );
    return { note: outNote, txHash: context.tx! };
  }
}
