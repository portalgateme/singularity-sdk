import {
  AerodromeAddLiquidityProofResult,
  Note,
  PartialNote,
  createPartialNote,
  generateAerodromeAddLiquidityProof,
  recoverNoteWithFooter
} from '@thesingularitynetwork/darkpool-v1-proof';
import AerodromeAddLiquidityAssetManagerAbi from '../../abis/AerodromeAddLiquidityAssetManager.json';
import { Action, relayerPathConfig } from '../../config/config';
import { DarkPool } from '../../darkpool';
import { AerodromeAddLiquidityRelayerRequest, DarkpoolError } from '../../entities';
import { Relayer } from '../../entities/relayer';
import { hexlify32 } from '../../utils/util';
import { BaseRelayerContext, BaseRelayerService, MultiNotesResult } from '../BaseService';
import { getOutEvent } from '../EventService';
import { getMerklePathAndRoot } from '../merkletree';

export interface AerodromeAddLiquidityRequest {
  inNote1: Note;
  inNote2: Note;
  poolAddress: string;
  lpTokenAddress: string;
  stable: boolean;
  minExpectedInAmount1: bigint;
  minExpectedInAmount2: bigint;
  deadline: bigint;
}

class AerodromeAddLiquidityContext extends BaseRelayerContext {
  private _request?: AerodromeAddLiquidityRequest;
  private _proof?: AerodromeAddLiquidityProofResult;
  private _outLpTokenPartialNote?: PartialNote;
  private _outPartialChangeNote1?: PartialNote;
  private _outPartialChangeNote2?: PartialNote;

  constructor(relayer: Relayer, signature: string) {
    super(relayer, signature);
  }

  set request(request: AerodromeAddLiquidityRequest | undefined) {
    this._request = request;
  }

  get request(): AerodromeAddLiquidityRequest | undefined {
    return this._request;
  }

  set proof(proof: AerodromeAddLiquidityProofResult | undefined) {
    this._proof = proof;
  }

  get proof(): AerodromeAddLiquidityProofResult | undefined {
    return this._proof;
  }

  set outLpTokenPartialNote(outLpTokenPartialNote: PartialNote | undefined) {
    this._outLpTokenPartialNote = outLpTokenPartialNote;
  }

  get outLpTokenPartialNote(): PartialNote | undefined {
    return this._outLpTokenPartialNote;
  }

  set outPartialChangeNote1(outPartialChangeNote1: PartialNote | undefined) {
    this._outPartialChangeNote1 = outPartialChangeNote1;
  }

  get outPartialChangeNote1(): PartialNote | undefined {
    return this._outPartialChangeNote1;
  }

  set outPartialChangeNote2(outPartialChangeNote2: PartialNote | undefined) {
    this._outPartialChangeNote2 = outPartialChangeNote2;
  }

  get outPartialChangeNote2(): PartialNote | undefined {
    return this._outPartialChangeNote2;
  }
}

export class AerodromeAddLiquidityService extends BaseRelayerService<
  AerodromeAddLiquidityContext,
  AerodromeAddLiquidityRelayerRequest,
  MultiNotesResult
> {
  constructor(_darkPool: DarkPool) {
    super(_darkPool);
  }

  public async prepare(
    request: AerodromeAddLiquidityRequest,
    signature: string
  ): Promise<{ context: AerodromeAddLiquidityContext; outPartialNotes: PartialNote[] }> {
    const outLpTokenPartialNote = await createPartialNote(request.lpTokenAddress, signature);
    const outPartialChangeNote1 = await createPartialNote(request.inNote1.asset, signature);
    const outPartialChangeNote2 = await createPartialNote(request.inNote2.asset, signature);

    const context = new AerodromeAddLiquidityContext(this._darkPool.getRelayer(), signature);
    context.request = request;
    context.outLpTokenPartialNote = outLpTokenPartialNote;
    context.outPartialChangeNote1 = outPartialChangeNote1;
    context.outPartialChangeNote2 = outPartialChangeNote2;

    return { context, outPartialNotes: [outLpTokenPartialNote, outPartialChangeNote1, outPartialChangeNote2] };
  }

  public async generateProof(context: AerodromeAddLiquidityContext): Promise<void> {
    if (
      !context ||
      !context.request ||
      !context.outLpTokenPartialNote ||
      !context.outPartialChangeNote1 ||
      !context.outPartialChangeNote2 ||
      !context.signature
    ) {
      throw new DarkpoolError('Invalid context');
    }

    const path1 = await getMerklePathAndRoot(context.request.inNote1.note, this._darkPool);
    const path2 = await getMerklePathAndRoot(context.request.inNote2.note, this._darkPool);

    const proof = await generateAerodromeAddLiquidityProof({
      note1: context.request.inNote1,
      note2: context.request.inNote2,
      merkleRoot: path1.root,
      note1MerklePath: path1.path,
      note1MerkleIndex: path1.index,
      note2MerklePath: path2.path,
      note2MerkleIndex: path2.index,
      stable: context.request.stable,
      minDepositedAmount1: context.request.minExpectedInAmount1,
      minDepositedAmount2: context.request.minExpectedInAmount2,
      deadline: context.request.deadline,
      outLpTokenPartialNote: context.outLpTokenPartialNote,
      outChangePartialNote1: context.outPartialChangeNote1,
      outChangePartialNote2: context.outPartialChangeNote2,
      relayer: context.relayer.relayerAddress,
      signedMessage: context.signature,
      options: this._darkPool.proofOptions
    });
    context.merkleRoot = path1.root;
    context.proof = proof;
  }

  protected async getRelayerRequest(
    context: AerodromeAddLiquidityContext
  ): Promise<AerodromeAddLiquidityRelayerRequest> {
    if (
      !context ||
      !context.request ||
      !context.outLpTokenPartialNote ||
      !context.outPartialChangeNote1 ||
      !context.outPartialChangeNote2 ||
      !context.signature ||
      !context.merkleRoot ||
      !context.proof
    ) {
      throw new DarkpoolError('Invalid context');
    }

    const relayerRequest: AerodromeAddLiquidityRelayerRequest = {
      proof: context.proof.proof.proof,
      inNullifier1: hexlify32(context.proof.inNoteNullifier1),
      inNullifier2: hexlify32(context.proof.inNoteNullifier2),
      inAsset1: context.request.inNote1.asset,
      inAsset2: context.request.inNote2.asset,
      inAmount1: hexlify32(context.request.inNote1.amount),
      inAmount2: hexlify32(context.request.inNote2.amount),
      pool: context.request.poolAddress,
      stable: context.request.stable,
      amount1Min: hexlify32(context.request.minExpectedInAmount1),
      amount2Min: hexlify32(context.request.minExpectedInAmount2),
      deadline: hexlify32(context.request.deadline),
      outNoteFooter: hexlify32(context.outLpTokenPartialNote.footer),
      outChangeFooter1: hexlify32(context.outPartialChangeNote1.footer),
      outChangeFooter2: hexlify32(context.outPartialChangeNote2.footer),
      refundToken1: hexlify32(0n),
      refundToken2: hexlify32(0n),
      verifierArgs: context.proof.proof.verifyInputs,
      relayer: context.relayer.relayerAddress,
      merkleRoot: context.merkleRoot
    };

    return relayerRequest;
  }

  protected getRelayerPath(): string {
    return relayerPathConfig[Action.AERODROME_LP_DEPOSIT];
  }

  protected async postExecute(context: AerodromeAddLiquidityContext): Promise<MultiNotesResult> {
    if (
      !context ||
      !context.request ||
      !context.tx ||
      !context.outLpTokenPartialNote ||
      !context.outPartialChangeNote1 ||
      !context.outPartialChangeNote2 ||
      !context.signature
    ) {
      throw new DarkpoolError('Invalid context');
    }

    const event = await getOutEvent(
      context.tx,
      AerodromeAddLiquidityAssetManagerAbi.abi,
      'AerodromeAddLiquidity',
      this._darkPool
    );
    if (!event || !event.args || !event.args[2]) {
      throw new DarkpoolError('Can not find AerodromeAddLiquidity Event from transaction: ' + context.tx);
    }

    const amountsOut = event.args[2];

    const resultNotes: Note[] = [];
    const lpTokenNote = await recoverNoteWithFooter(
      context.outLpTokenPartialNote.rho,
      context.outLpTokenPartialNote.asset,
      BigInt(amountsOut[2]),
      context.signature
    );
    resultNotes.push(lpTokenNote);
    if (amountsOut[0] && BigInt(amountsOut[0]) > BigInt(0)) {
      const changeNote1 = await recoverNoteWithFooter(
        context.outPartialChangeNote1.rho,
        context.outPartialChangeNote1.asset,
        BigInt(amountsOut[0]),
        context.signature
      );
      resultNotes.push(changeNote1);
    }
    if (amountsOut[1] && BigInt(amountsOut[1]) > BigInt(0)) {
      const changeNote2 = await recoverNoteWithFooter(
        context.outPartialChangeNote2.rho,
        context.outPartialChangeNote2.asset,
        BigInt(amountsOut[1]),
        context.signature
      );
      resultNotes.push(changeNote2);
    }

    return { notes: resultNotes, txHash: context.tx };
  }
}
