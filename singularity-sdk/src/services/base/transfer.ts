import {
  Note,
  TransferProofResult,
  generateTransferProof,
  createNoteWithFooter
} from '@thesingularitynetwork/darkpool-v1-proof';

import { hexlify32 } from '../../utils/util';
import { BaseContext, BaseContractService, transferCodeToNoteFooter } from '../BaseService';
import { ethers } from 'ethers';
import { DarkpoolError, Token } from '../../entities';
import { DarkPool } from '../../darkpool';
import { getMerklePathAndRoot } from '../merkletree';
import DarkpoolAssetManagerAbi from '../../abis/DarkpoolAssetManager.json';

class TransferContext extends BaseContext {
  private _outNoteFooter?: bigint;
  private _inNote?: Note;
  private _proof?: TransferProofResult;

  constructor(signature: string) {
    super(signature);
  }

  set inNote(inNote: Note | undefined) {
    this._inNote = inNote;
  }

  get inNote(): Note | undefined {
    return this._inNote;
  }

  set outNoteFooter(note: bigint | undefined) {
    this._outNoteFooter = note;
  }

  get outNoteFooter(): bigint | undefined {
    return this._outNoteFooter;
  }

  set proof(proof: TransferProofResult | undefined) {
    this._proof = proof;
  }

  get proof(): TransferProofResult | undefined {
    return this._proof;
  }
}

export class TransferService extends BaseContractService<TransferContext> {
  constructor(_darkPool: DarkPool) {
    super(_darkPool);
  }

  static async receiverPrepare(asset: Token, amount: bigint, signature: string) {
    const noteExt = await createNoteWithFooter(amount, asset.address, signature);
    return noteExt;
  }

  public async prepare(
    inNote: Note,
    transferCode: string,
    signature: string
  ): Promise<{ context: TransferContext; outNotes: Note[] }> {
    const outNoteFooter = await transferCodeToNoteFooter(transferCode, this._darkPool.chainId);
    const context = new TransferContext(signature);
    context.inNote = inNote;
    context.outNoteFooter = outNoteFooter;

    return { context, outNotes: [] };
  }

  public async generateProof(context: TransferContext): Promise<void> {
    if (!context || !context.outNoteFooter || !context.signature || !context.inNote) {
      throw new DarkpoolError('Invalid context');
    }

    const path = await getMerklePathAndRoot(context.inNote.note, this._darkPool);
    const proof = await generateTransferProof({
      inNote: context.inNote,
      outNoteFooter: context.outNoteFooter,
      signedMessage: context.signature,
      merkleRoot: path.root,
      merklePath: path.path,
      merkleIndex: path.index,
      options: this._darkPool.proofOptions
    });
    context.proof = proof;
    context.merkleRoot = path.root;
  }

  public async execute(context: TransferContext): Promise<string> {
    const contractParam = this.getContractCallParameters(context);
    const signer = this._darkPool.signer;
    const contract = new ethers.Contract(
      this._darkPool.contracts.darkpoolAssetManager,
      DarkpoolAssetManagerAbi.abi,
      signer
    );

    const tx = await contract.transfer(
      contractParam.merkleRoot,
      contractParam.inNoteNullifier,
      contractParam.asset,
      contractParam.amount,
      contractParam.outNote,
      contractParam.outNoteFooter,
      contractParam.proof.proof
    );

    return tx.hash;
  }

  public getContractCallParameters(context: TransferContext) {
    if (
      !context ||
      !context.outNoteFooter ||
      !context.signature ||
      !context.proof ||
      !context.merkleRoot ||
      !context.inNote
    ) {
      throw new DarkpoolError('Invalid context');
    }

    return {
      merkleRoot: context.merkleRoot,
      inNoteNullifier: context.proof.inNoteNullifier,
      asset: context.inNote.asset,
      amount: context.inNote.amount,
      outNote: context.proof.outNote,
      outNoteFooter: hexlify32(context.outNoteFooter),
      proof: context.proof.proof
    };
  }
}
