import {
  JoinSplitProofResult,
  Note,
  createNote,
  generateJoinSplitProof
} from '@thesingularitynetwork/darkpool-v1-proof';
import { ethers } from 'ethers';
import DarkpoolAssetManagerAbi from '../../abis/DarkpoolAssetManager.json';
import { DarkPool } from '../../darkpool';
import { hexlify32, isAddressEquals } from '../../utils/util';
import { BaseContext, BaseContractService } from '../BaseService';
import { multiGetMerklePathAndRoot } from '../merkletree';
import { DarkpoolError } from '../../entities';

class JoinSplitContext extends BaseContext {
  private _inNote1?: Note;
  private _inNote2?: Note;
  private _outNote1?: Note;
  private _outNote2?: Note;
  private _proof?: JoinSplitProofResult;

  constructor(signature: string) {
    super(signature);
  }

  set inNote1(note: Note | undefined) {
    this._inNote1 = note;
  }

  get inNote1(): Note | undefined {
    return this._inNote1;
  }

  set inNote2(note: Note | undefined) {
    this._inNote2 = note;
  }

  get inNote2(): Note | undefined {
    return this._inNote2;
  }

  set outNote1(note: Note | undefined) {
    this._outNote1 = note;
  }

  get outNote1(): Note | undefined {
    return this._outNote1;
  }

  set outNote2(note: Note | undefined) {
    this._outNote2 = note;
  }

  get outNote2(): Note | undefined {
    return this._outNote2;
  }

  set proof(proof: JoinSplitProofResult | undefined) {
    this._proof = proof;
  }

  get proof(): JoinSplitProofResult | undefined {
    return this._proof;
  }
}

export class JoinSplitService extends BaseContractService<JoinSplitContext> {
  constructor(_darkPool: DarkPool) {
    super(_darkPool);
  }

  public async prepare(
    inNote1: Note,
    inNote2: Note,
    outAmount1: bigint,
    signature: string
  ): Promise<{ context: JoinSplitContext; outNotes: Note[] }> {
    if (!isAddressEquals(inNote1.asset, inNote2.asset)) {
      throw new DarkpoolError('inNote1 and inNote2 must have the same asset');
    }

    if (inNote1.note === inNote2.note) {
      throw new DarkpoolError('inNote1 and inNote2 must have different note');
    }

    if (inNote1.amount + inNote2.amount <= outAmount1 || outAmount1 <= 0) {
      throw new DarkpoolError('Invalid join split amounts');
    }

    const outAmount2 = inNote1.amount + inNote2.amount - outAmount1;

    const outNote1 = await createNote(inNote1.asset, outAmount1, signature);
    const outNote2 = await createNote(inNote2.asset, outAmount2, signature);
    const context = new JoinSplitContext(signature);
    context.inNote1 = inNote1;
    context.inNote2 = inNote2;
    context.outNote1 = outNote1;
    context.outNote2 = outNote2;
    return { context, outNotes: [outNote1, outNote2] };
  }

  public async generateProof(context: JoinSplitContext): Promise<void> {
    if (
      !context ||
      !context.inNote1 ||
      !context.inNote2 ||
      !context.outNote1 ||
      !context.outNote2 ||
      !context.signature
    ) {
      throw new DarkpoolError('Invalid context');
    }

    const merklePathes = await multiGetMerklePathAndRoot([context.inNote1.note, context.inNote2.note], this._darkPool);
    const path1 = merklePathes[0];
    const path2 = merklePathes[1];

    const proof = await generateJoinSplitProof({
      inNote1: context.inNote1,
      inNote2: context.inNote2,
      outNote1: context.outNote1,
      outNote2: context.outNote2,
      merkleRoot: path1.root,
      note1MerklePath: path1.path,
      note1MerkleIndex: path1.index,
      note2MerklePath: path2.path,
      note2MerkleIndex: path2.index,
      signedMessage: context.signature,
      options: this._darkPool.proofOptions
    });
    context.proof = proof;
  }

  public async execute(context: JoinSplitContext): Promise<string> {
    if (
      !context ||
      !context.inNote1 ||
      !context.inNote2 ||
      !context.outNote1 ||
      !context.outNote2 ||
      !context.signature ||
      !context.proof
    ) {
      throw new DarkpoolError('Invalid context');
    }

    const contract = new ethers.Contract(
      this._darkPool.contracts.darkpoolAssetManager,
      DarkpoolAssetManagerAbi.abi,
      this._darkPool.signer
    );
    const tx = await contract.join(
      context.proof.inNoteNullifier1,
      context.proof.inNoteNullifier2,
      hexlify32(context.outNote1.note),
      hexlify32(context.outNote2.note),
      context.proof.outNoteFooter1,
      context.proof.outNoteFooter2,
      context.proof.proof.proof
    );
    return tx.hash;
  }
}
