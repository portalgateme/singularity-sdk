import {
  Note,
  TransferProofResult,
  generateTransferProof,
  createNoteWithFooter,
  BobTransferMessage
} from '@thesingularitynetwork/darkpool-v1-proof';

import { hexlify32 } from '../../utils/util';
import { BaseContext, BaseContractService } from '../BaseService';
import { ethers } from 'ethers';
import { DarkpoolError, Token } from '../../entities';
import { DarkPool } from '../../darkpool';
import { getMerklePathAndRoot } from '../merkletree';
import TransferAssetManagerAbi from '../../abis/TransferAssetManager.json';

class TransferContext extends BaseContext {
  private _bobTransferMessage?: BobTransferMessage;
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

  set bobTransferMessage(bobTransferMessage: BobTransferMessage | undefined) {
    this._bobTransferMessage = bobTransferMessage;
  }

  get bobTransferMessage(): BobTransferMessage | undefined {
    return this._bobTransferMessage;
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
    bobTransferMessage: BobTransferMessage,
    signature: string
  ): Promise<{ context: TransferContext; outNotes: Note[] }> {
    const context = new TransferContext(signature);
    context.inNote = inNote;
    context.bobTransferMessage = bobTransferMessage;

    return { context, outNotes: [] };
  }

  public async generateProof(context: TransferContext): Promise<void> {
    if (!context || !context.bobTransferMessage || !context.signature || !context.inNote) {
      throw new DarkpoolError('Invalid context');
    }

    const path = await getMerklePathAndRoot(context.inNote.note, this._darkPool);
    const proof = await generateTransferProof({
      aliceInNote: context.inNote,
      aliceSignedMessage: context.signature,
      aliceMerkleRoot: path.root,
      aliceMerklePath: path.path,
      aliceMerkleIndex: path.index,
      bobOutNote: context.bobTransferMessage.note,
      bobPubKey: context.bobTransferMessage.pubKey,
      bobSignature: context.bobTransferMessage.signature,
      options: this._darkPool.proofOptions
    });
    context.proof = proof;
    context.merkleRoot = path.root;
  }

  public async execute(context: TransferContext): Promise<string> {
    if (
      !context ||
      !context.bobTransferMessage ||
      !context.signature ||
      !context.proof ||
      !context.merkleRoot ||
      !context.inNote
    ) {
      throw new DarkpoolError('Invalid context');
    }

    const signer = this._darkPool.signer;
    const contract = new ethers.Contract(
      this._darkPool.contracts.transferAssetManager,
      TransferAssetManagerAbi.abi,
      signer
    );

    const tx = await contract.transfer(
      context.merkleRoot,
      context.proof.aliceInNoteNullifier,
      hexlify32(context.bobTransferMessage.note.note),
      context.proof.bobOutNoteFooter,
      context.proof.proof.proof
    );

    return tx.hash;
  }
}
