import {
  darkPoolMakerCreateOrderProofResult,
  generateDarkPoolMakerCreateOrderProof,
  Note
} from '@thesingularitynetwork/darkpool-v1-proof';
import { ethers } from 'ethers';
import DarkpoolSwapAssetManagerAbi from '../../abis/DarkPoolSwapAssetManager.json';
import { DarkPool } from '../../darkpool';
import { DarkpoolError } from '../../entities';
import { BaseContext, BaseContractService } from '../BaseService';
import { getMerklePathAndRoot } from '../merkletree';

class CreateMakerOrderContext extends BaseContext {
  private _outgoingNote?: Note;
  private _proof?: darkPoolMakerCreateOrderProofResult;

  constructor(signature: string) {
    super(signature);
  }

  set outgoingNote(note: Note | undefined) {
    this._outgoingNote = note;
  }

  get outgoingNote(): Note | undefined {
    return this._outgoingNote;
  }

  set proof(proof: darkPoolMakerCreateOrderProofResult | undefined) {
    this._proof = proof;
  }

  get proof(): darkPoolMakerCreateOrderProofResult | undefined {
    return this._proof;
  }
}

export class CreateMakerOrderService extends BaseContractService<CreateMakerOrderContext> {
  constructor(_darkPool: DarkPool) {
    super(_darkPool);
  }

  public async prepare(
    outgoingNote: Note,
    signature: string
  ): Promise<{ context: CreateMakerOrderContext; outNotes: Note[] }> {
    const context = new CreateMakerOrderContext(signature);
    context.outgoingNote = outgoingNote;
    return { context, outNotes: [] };
  }

  public async generateProof(context: CreateMakerOrderContext): Promise<void> {
    if (!context || !context.outgoingNote) {
      throw new DarkpoolError('Invalid context');
    }

    const merklePath = await getMerklePathAndRoot(context.outgoingNote.note, this._darkPool);
    context.merkleRoot = merklePath.root;

    const proof = await generateDarkPoolMakerCreateOrderProof({
      merkleRoot: merklePath.root,
      merklePath: merklePath.path,
      merkleIndex: merklePath.index,
      outNote: context.outgoingNote,
      inAsset: context.outgoingNote.asset,
      inAmount: context.outgoingNote.amount,
      signedMessage: context.signature,
      options: this._darkPool.proofOptions
    });
    context.proof = proof;
  }

  public async execute(context: CreateMakerOrderContext): Promise<string> {
    if (!context || !context.outgoingNote || !context.proof || !context.merkleRoot) {
      throw new DarkpoolError('Invalid context');
    }
    const contract = new ethers.Contract(
      this._darkPool.contracts.darkpoolSwapAssetManager,
      DarkpoolSwapAssetManagerAbi.abi,
      this._darkPool.signer
    );
    const tx = await contract.makerCreateOrder(
      context.merkleRoot,
      context.proof.outNullifier,
      context.proof.proof.proof
    );
    return tx.hash;
  }
}
