import {
  NftNote,
  Note,
  TransferProofResult,
  createPartialNote,
  generateTransferNftProof
} from '@thesingularitynetwork/darkpool-v1-proof';
import { ethers } from 'ethers';
import { DarkPool } from '../../darkpool';
import { DarkpoolError } from '../../entities';
import { hexlify32 } from '../../utils/util';
import { BaseContext, BaseContractService } from '../BaseService';

import NftAssetManagerAbi from '../../abis/NftAssetManager.json';

import { getMerklePathAndRoot } from '../merkletree';

export class TransferStreamSablierContext extends BaseContext {
  private _address?: string;
  private _proof?: TransferProofResult;
  private _nftNote?: NftNote;
  private _outNoteFooter?: bigint;

  constructor(signature: string) {
    super(signature);
  }

  set outNoteFooter(outNoteFooter: bigint | undefined) {
    this._outNoteFooter = outNoteFooter;
  }

  get outNoteFooter(): bigint | undefined {
    return this._outNoteFooter;
  }

  set nftNote(nftNote: NftNote | undefined) {
    this._nftNote = nftNote;
  }

  get nftNote(): NftNote | undefined {
    return this._nftNote;
  }

  set address(address: string | undefined) {
    this._address = address;
  }

  get address(): string | undefined {
    return this._address;
  }

  set proof(proof: TransferProofResult | undefined) {
    this._proof = proof;
  }

  get proof(): TransferProofResult | undefined {
    return this._proof;
  }
}

export class TransferStreamSablierService extends BaseContractService<TransferStreamSablierContext> {
  constructor(_darkPool: DarkPool) {
    super(_darkPool);
  }

  static async receiverPrepare(asset: string, signature: string) {
    const outPartialNote = await createPartialNote(asset, signature);
    return outPartialNote;
  }

  public async prepare(
    nftNote: NftNote,
    outNoteFooter: bigint,
    walletAddress: string,
    signature: string
  ): Promise<{ context: TransferStreamSablierContext; outNotes: Note[] }> {
    const context = new TransferStreamSablierContext(signature);
    context.address = walletAddress;
    context.nftNote = nftNote;
    context.outNoteFooter = outNoteFooter;
    return { context, outNotes: [] };
  }

  public async generateProof(context: TransferStreamSablierContext): Promise<void> {
    if (!context || !context.address || !context.signature || !context.nftNote || !context.outNoteFooter) {
      throw new DarkpoolError('Invalid context');
    }

    const path = await getMerklePathAndRoot(context.nftNote.note, this._darkPool);

    const proof = await generateTransferNftProof({
      inNote: context.nftNote,
      merkleRoot: path.root,
      merklePath: path.path,
      merkleIndex: path.index,
      signedMessage: context.signature,
      outNoteFooter: context.outNoteFooter,
      options: this._darkPool.proofOptions
    });
    context.proof = proof;
    context.merkleRoot = path.root;
  }

  public async execute(context: TransferStreamSablierContext): Promise<string> {
    if (
      !context ||
      !context.address ||
      !context.signature ||
      !context.proof ||
      !context.nftNote ||
      !context.outNoteFooter ||
      !context.merkleRoot
    ) {
      throw new DarkpoolError('Invalid context');
    }
    const signer = this._darkPool.signer;
    const contract = new ethers.Contract(this._darkPool.contracts.nftAssetManager, NftAssetManagerAbi.abi, signer);

    const tx = await contract.transfer(
      context.merkleRoot,
      context.proof.inNoteNullifier,
      context.nftNote.address,
      hexlify32(context.nftNote.tokenId),
      context.proof.outNote,
      hexlify32(context.outNoteFooter),
      context.proof.proof.proof
    );
    return tx.hash;
  }

  public getContractCallParameters(context: TransferStreamSablierContext) {
    if (
      !context ||
      !context.nftNote ||
      !context.address ||
      !context.signature ||
      !context.proof ||
      !context.outNoteFooter
    ) {
      throw new DarkpoolError('Invalid context');
    }

    return [
      context.merkleRoot,
      context.proof.inNoteNullifier,
      context.nftNote.address,
      hexlify32(context.nftNote.tokenId),
      context.proof.outNote,
      hexlify32(context.outNoteFooter),
      context.proof.proof.proof
    ];
  }
}
