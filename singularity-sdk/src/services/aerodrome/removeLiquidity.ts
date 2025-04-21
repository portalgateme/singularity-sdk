import {
  AerodromeRemoveLiquidityProofResult,
  Note,
  PartialNote,
  createPartialNote,
  generateAerodromeRemoveLiquidityProof,
  recoverNoteWithFooter
} from '@thesingularitynetwork/darkpool-v1-proof';
import AerodromeRemoveLiquidityAssetManagerAbi from '../../abis/AerodromeRemoveLiquidityAssetManager.json';
import { Action, relayerPathConfig } from '../../config/config';
import { DarkPool } from '../../darkpool';
import { AerodromeRemoveLiquidityRelayerRequest, DarkpoolError } from '../../entities';
import { Relayer } from '../../entities/relayer';
import { Token } from '../../entities/token';
import { hexlify32 } from '../../utils/util';
import { BaseRelayerContext, BaseRelayerService, MultiNotesResult } from '../BaseService';
import { getOutEvent } from '../EventService';
import { getMerklePathAndRoot } from '../merkletree';

export interface AerodromeRemoveLiquidityRequest {
  inNote: Note;
  liquidityAmountBurn: bigint;
  stable: boolean;
  poolAddress: string;
  outAsset1: Token;
  outAsset2: Token;
  minExpectedOutAmount1: bigint;
  minExpectedOutAmount2: bigint;
  deadline: bigint;
}

class AerodromeRemoveLiquidityContext extends BaseRelayerContext {
  private _request?: AerodromeRemoveLiquidityRequest;
  private _proof?: AerodromeRemoveLiquidityProofResult;
  private _outPartialNote1?: PartialNote;
  private _outPartialNote2?: PartialNote;
  private _outChangePartialNote?: PartialNote;

  constructor(relayer: Relayer, signature: string) {
    super(relayer, signature);
  }

  public get request(): AerodromeRemoveLiquidityRequest | undefined {
    return this._request;
  }

  public set request(value: AerodromeRemoveLiquidityRequest | undefined) {
    this._request = value;
  }

  public get proof(): AerodromeRemoveLiquidityProofResult | undefined {
    return this._proof;
  }

  public set proof(value: AerodromeRemoveLiquidityProofResult | undefined) {
    this._proof = value;
  }

  public get outPartialNote1(): PartialNote | undefined {
    return this._outPartialNote1;
  }

  public set outPartialNote1(value: PartialNote | undefined) {
    this._outPartialNote1 = value;
  }

  public get outPartialNote2(): PartialNote | undefined {
    return this._outPartialNote2;
  }

  public set outPartialNote2(value: PartialNote | undefined) {
    this._outPartialNote2 = value;
  }

  public get outChangePartialNote(): PartialNote | undefined {
    return this._outChangePartialNote;
  }

  public set outChangePartialNote(value: PartialNote | undefined) {
    this._outChangePartialNote = value;
  }
}

export class AerodromeRemoveLiquidityService extends BaseRelayerService<
  AerodromeRemoveLiquidityContext,
  AerodromeRemoveLiquidityRelayerRequest,
  MultiNotesResult
> {
  constructor(_darkPool: DarkPool) {
    super(_darkPool);
  }

  public async prepare(
    request: AerodromeRemoveLiquidityRequest,
    signature: string
  ): Promise<{ context: AerodromeRemoveLiquidityContext; outPartialNotes: PartialNote[] }> {
    const outPartialNote1 = await createPartialNote(request.outAsset1.address, signature);
    const outPartialNote2 = await createPartialNote(request.outAsset2.address, signature);
    const outChangePartialNote = await createPartialNote(request.inNote.asset, signature);

    const context = new AerodromeRemoveLiquidityContext(this._darkPool.getRelayer(), signature);
    context.request = request;
    context.outPartialNote1 = outPartialNote1;
    context.outPartialNote2 = outPartialNote2;
    context.outChangePartialNote = outChangePartialNote;

    return { context, outPartialNotes: [outPartialNote1, outPartialNote2, outChangePartialNote] };
  }

  public async generateProof(context: AerodromeRemoveLiquidityContext): Promise<void> {
    if (
      !context ||
      !context.request ||
      !context.outPartialNote1 ||
      !context.outPartialNote2 ||
      !context.outChangePartialNote ||
      !context.signature
    ) {
      throw new DarkpoolError('Invalid context');
    }

    const path = await getMerklePathAndRoot(context.request.inNote.note, this._darkPool);

    const proof = await generateAerodromeRemoveLiquidityProof({
      inNote: context.request.inNote,
      liquidityAmountBurn: context.request.liquidityAmountBurn,
      merkleRoot: path.root,
      merklePath: path.path,
      merkleIndex: path.index,
      outNote1: context.outPartialNote1,
      outNote2: context.outPartialNote2,
      outChangePartialNote: context.outChangePartialNote,
      stable: context.request.stable,
      outMinAmount1: context.request.minExpectedOutAmount1,
      outMinAmount2: context.request.minExpectedOutAmount2,
      deadline: context.request.deadline,
      relayer: context.relayer.relayerAddress,
      signedMessage: context.signature,
      options: this._darkPool.proofOptions
    });
    context.merkleRoot = path.root;
    context.proof = proof;
  }

  protected async getRelayerRequest(
    context: AerodromeRemoveLiquidityContext
  ): Promise<AerodromeRemoveLiquidityRelayerRequest> {
    if (
      !context ||
      !context.request ||
      !context.outPartialNote1 ||
      !context.outPartialNote2 ||
      !context.outChangePartialNote ||
      !context.signature ||
      !context.merkleRoot ||
      !context.proof
    ) {
      throw new DarkpoolError('Invalid context');
    }

    const relayerRequest: AerodromeRemoveLiquidityRelayerRequest = {
      proof: context.proof.proof.proof,
      merkleRoot: context.merkleRoot,
      nullifier: hexlify32(context.proof.inNoteNullifier),
      pool: context.request.poolAddress,
      amount: hexlify32(context.request.inNote.amount),
      amountBurn: hexlify32(context.request.liquidityAmountBurn),
      stable: context.request.stable,
      outAsset1: context.request.outAsset1.address,
      outAsset2: context.request.outAsset2.address,
      outAmount1Min: hexlify32(context.request.minExpectedOutAmount1),
      outAmount2Min: hexlify32(context.request.minExpectedOutAmount2),
      deadline: hexlify32(context.request.deadline),
      outNoteFooter1: hexlify32(context.outPartialNote1.footer),
      outNoteFooter2: hexlify32(context.outPartialNote2.footer),
      outChangeNoteFooter: hexlify32(context.outChangePartialNote.footer),
      refundToken1: hexlify32(0n),
      refundToken2: hexlify32(0n),
      verifierArgs: context.proof.proof.verifyInputs,
      relayer: context.relayer.relayerAddress
    };

    return relayerRequest;
  }

  protected getRelayerPath(): string {
    return relayerPathConfig[Action.AERODROME_LP_WITHDRAW];
  }

  protected async postExecute(context: AerodromeRemoveLiquidityContext): Promise<MultiNotesResult> {
    if (
      !context ||
      !context.request ||
      !context.tx ||
      !context.outPartialNote1 ||
      !context.outPartialNote2 ||
      !context.outChangePartialNote ||
      !context.signature
    ) {
      throw new DarkpoolError('Invalid context');
    }

    const event = await getOutEvent(
      context.tx,
      AerodromeRemoveLiquidityAssetManagerAbi.abi,
      'AerodromeRemoveLiquidity',
      this._darkPool
    );

    if (!event || !event.args || !event.args[2]) {
      throw new DarkpoolError('Can not find AerodromeRemoveLiquidity Event from transaction: ' + context.tx);
    }

    const amountsOut = event.args[2];

    const resultNotes: Note[] = [];

    const outNote1 = await recoverNoteWithFooter(
      context.outPartialNote1.rho,
      context.outPartialNote1.asset,
      BigInt(amountsOut[0]),
      context.signature
    );

    resultNotes.push(outNote1);

    const outNote2 = await recoverNoteWithFooter(
      context.outPartialNote2.rho,
      context.outPartialNote2.asset,
      BigInt(amountsOut[1]),
      context.signature
    );
    resultNotes.push(outNote2);

    if (BigInt(amountsOut[2]) > 0n) {
      const lpTokenChangeNote = await recoverNoteWithFooter(
        context.outPartialNote1.rho,
        context.outPartialNote1.asset,
        BigInt(amountsOut[2]),
        context.signature
      );
      resultNotes.push(lpTokenChangeNote);
    }

    return { notes: resultNotes, txHash: context.tx };
  }
}
