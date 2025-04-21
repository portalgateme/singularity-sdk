import {
  NftNote,
  Note,
  PartialNftNote,
  PartialNote,
  UniswapAddLiquidProofResult,
  createPartialNftNote,
  createPartialNote,
  generateUniswapAddLiquidityProof,
  recoverNftNote,
  recoverNoteWithFooter
} from '@thesingularitynetwork/darkpool-v1-proof';
import { ethers } from 'ethers';
import UniswapLiquidityAssetManagerAbi from '../../abis/UniswapLiquidityAssetManager.json';
import { Action, relayerPathConfig } from '../../config/config';
import { DarkPool } from '../../darkpool';
import { DarkpoolError } from '../../entities';
import { Relayer } from '../../entities/relayer';
import { UniswapAddLiquidityRelayerRequest } from '../../entities/relayerRequestTypes';
import { hexlify32 } from '../../utils/util';
import { BaseRelayerContext, BaseRelayerService, MultiNotesResult } from '../BaseService';
import { getMerklePathAndRoot } from '../merkletree';

export interface UniswapAddLiquidityRequest {
  inNote1: Note;
  inNote2: Note;
  feeTier: number;
  tickLower: number;
  tickUpper: number;
  poolAddress: string;
  minExpectedInAmount1: bigint;
  minExpectedInAmount2: bigint;
  deadline: number;
}

class UniswapAddLiquidityContext extends BaseRelayerContext {
  private _request?: UniswapAddLiquidityRequest;
  private _proof?: UniswapAddLiquidProofResult;
  private _outPartialNftNote?: PartialNftNote;
  private _outPartialChangeNote1?: PartialNote;
  private _outPartialChangeNote2?: PartialNote;

  constructor(relayer: Relayer, signature: string) {
    super(relayer, signature);
  }

  set request(request: UniswapAddLiquidityRequest | undefined) {
    this._request = request;
  }

  get request(): UniswapAddLiquidityRequest | undefined {
    return this._request;
  }

  set proof(proof: UniswapAddLiquidProofResult | undefined) {
    this._proof = proof;
  }

  get proof(): UniswapAddLiquidProofResult | undefined {
    return this._proof;
  }

  set outPartialNftNote(outPartialNftNote: PartialNftNote | undefined) {
    this._outPartialNftNote = outPartialNftNote;
  }

  get outPartialNftNote(): PartialNftNote | undefined {
    return this._outPartialNftNote;
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

export interface UniswapAddLiquidityResult extends MultiNotesResult {
  nftNote: NftNote;
}

export class UniswapAddLiquidityService extends BaseRelayerService<
  UniswapAddLiquidityContext,
  UniswapAddLiquidityRelayerRequest,
  UniswapAddLiquidityResult
> {
  constructor(_darkPool: DarkPool) {
    super(_darkPool);
  }

  private getV3PosAddress() {
    if (!this._darkPool.contracts.uniswapConfig) {
      throw new DarkpoolError('Uniswap config not found');
    }
    return this._darkPool.contracts.uniswapConfig.v3PosNftAddress;
  }

  public async prepare(
    request: UniswapAddLiquidityRequest,
    signature: string
  ): Promise<{
    context: UniswapAddLiquidityContext;
    outPartialNotes: PartialNote[];
    outPartialNftNote: PartialNftNote;
  }> {
    if (!this._darkPool.contracts.uniswapConfig) {
      throw new DarkpoolError('Uniswap config not found');
    }
    const outPartialNftNote = await createPartialNftNote(this.getV3PosAddress(), signature);
    const outPartialChangeNote1 = await createPartialNote(request.inNote1.asset, signature);
    const outPartialChangeNote2 = await createPartialNote(request.inNote2.asset, signature);

    const context = new UniswapAddLiquidityContext(this._darkPool.getRelayer(), signature);
    context.request = request;
    context.outPartialNftNote = outPartialNftNote;
    context.outPartialChangeNote1 = outPartialChangeNote1;
    context.outPartialChangeNote2 = outPartialChangeNote2;

    return { context, outPartialNotes: [outPartialChangeNote1, outPartialChangeNote2], outPartialNftNote };
  }

  public async generateProof(context: UniswapAddLiquidityContext): Promise<void> {
    if (
      !context ||
      !context.request ||
      !context.outPartialNftNote ||
      !context.outPartialChangeNote1 ||
      !context.outPartialChangeNote2
    ) {
      throw new DarkpoolError('Invalid context');
    }

    const path1 = await getMerklePathAndRoot(context.request.inNote1.note, this._darkPool);
    const path2 = await getMerklePathAndRoot(context.request.inNote2.note, this._darkPool);

    const proof = await generateUniswapAddLiquidityProof({
      note1: context.request.inNote1,
      note2: context.request.inNote2,
      merkleRoot: path1.root,
      note1MerklePath: path1.path,
      note1MerkleIndex: path1.index,
      note2MerklePath: path2.path,
      note2MerkleIndex: path2.index,
      tickMin: Math.min(context.request.tickLower, context.request.tickUpper),
      tickMax: Math.max(context.request.tickLower, context.request.tickUpper),
      outNftPartialNote: context.outPartialNftNote,
      outChangePartialNote1: context.outPartialChangeNote1,
      outChangePartialNote2: context.outPartialChangeNote2,
      amount1Min: context.request.minExpectedInAmount1,
      amount2Min: context.request.minExpectedInAmount2,
      deadline: context.request.deadline,
      feeTier: context.request.feeTier,
      relayer: context.relayer.relayerAddress,
      signedMessage: context.signature,
      options: this._darkPool.proofOptions
    });
    context.proof = proof;
  }

  protected async getRelayerRequest(context: UniswapAddLiquidityContext): Promise<UniswapAddLiquidityRelayerRequest> {
    if (
      !context ||
      !context.request ||
      !context.outPartialNftNote ||
      !context.outPartialChangeNote1 ||
      !context.outPartialChangeNote2 ||
      !context.signature ||
      !context.merkleRoot ||
      !context.proof
    ) {
      throw new DarkpoolError('Invalid context');
    }

    const relayerRequest: UniswapAddLiquidityRelayerRequest = {
      proof: context.proof.proof.proof,
      asset1: context.request.inNote1.asset,
      amount1: hexlify32(context.request.inNote1.amount),
      nullifier1: context.proof.inNote1Nullifier,
      asset2: context.request.inNote2.asset,
      amount2: hexlify32(context.request.inNote2.amount),
      nullifier2: context.proof.inNote2Nullifier,
      merkleRoot: context.merkleRoot,
      changeNoteFooter1: hexlify32(context.outPartialChangeNote1.footer),
      changeNoteFooter2: hexlify32(context.outPartialChangeNote2.footer),
      tickMin: Math.min(context.request.tickLower, context.request.tickUpper),
      tickMax: Math.max(context.request.tickLower, context.request.tickUpper),
      deadline: hexlify32(context.request.deadline),
      outNoteFooter: hexlify32(context.outPartialNftNote.footer),
      feeTier: hexlify32(context.request.feeTier),
      amountMin1: hexlify32(context.request.minExpectedInAmount1),
      amountMin2: hexlify32(context.request.minExpectedInAmount2),
      relayer: context.relayer.relayerAddress,
      refundToken1: hexlify32(0n),
      refundToken2: hexlify32(0n),
      verifierArgs: context.proof.proof.verifyInputs
    };

    return relayerRequest;
  }

  protected getRelayerPath(): string {
    return relayerPathConfig[Action.UNISWAP_LP_DEPOSIT];
  }

  protected async postExecute(context: UniswapAddLiquidityContext): Promise<UniswapAddLiquidityResult> {
    if (
      !context ||
      !context.request ||
      !context.tx ||
      !context.outPartialNftNote ||
      !context.outPartialChangeNote1 ||
      !context.outPartialChangeNote2 ||
      !context.signature
    ) {
      throw new DarkpoolError('Invalid context');
    }

    const [tokenId, changeAmounts, changeNoteCommitments] = await this.getTokenIdAndChangeAmounts(context.tx);
    if (!tokenId || !changeAmounts) {
      throw new DarkpoolError('Failed to find the UniswapLiquidityProvision event in the transaction receipt.');
    } else {
      const nftNote = await recoverNftNote(
        context.outPartialNftNote.rho,
        this.getV3PosAddress(),
        BigInt(tokenId),
        context.signature
      );

      let changeNote1;
      if (changeAmounts[0] && BigInt(changeAmounts[0]) > BigInt(0)) {
        changeNote1 = await recoverNoteWithFooter(
          context.outPartialChangeNote1.rho,
          context.outPartialChangeNote1.asset,
          BigInt(changeAmounts[0]),
          context.signature
        );
        console.log(changeNote1.note == changeNoteCommitments[0]);
      }
      let changeNote2;
      if (changeAmounts[1] && BigInt(changeAmounts[1]) > BigInt(0)) {
        changeNote2 = await recoverNoteWithFooter(
          context.outPartialChangeNote2.rho,
          context.outPartialChangeNote2.asset,
          BigInt(changeAmounts[1]),
          context.signature
        );
        console.log(changeNote2.note == changeNoteCommitments[0]);
      }

      let results = [];
      if (changeNote1) results.push(changeNote1);
      if (changeNote2) results.push(changeNote2);

      return { nftNote: nftNote, notes: results, txHash: context.tx };
    }
  }

  private async getTokenIdAndChangeAmounts(tx: string) {
    const iface = new ethers.Interface(UniswapLiquidityAssetManagerAbi.abi);
    const receipt = await this._darkPool.provider.getTransactionReceipt(tx);
    if (receipt && receipt.logs.length > 0) {
      const log = receipt.logs.find(log => log.topics[0] === 'UniswapLiquidityProvision');
      if (log) {
        const event = iface.parseLog(log);
        if (event) {
          return [event.args[0], event.args[3], event.args[4]];
        }
      }
    }

    return [null, null, null];
  }
}
