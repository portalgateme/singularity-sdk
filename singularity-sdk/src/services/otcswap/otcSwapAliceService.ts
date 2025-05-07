import {
  calcNullifier,
  generateKeyPair,
  generateOTCSwapProof,
  generateRho,
  getNoteFooter,
  Note,
  OTCSwapProofParam
} from '@thesingularitynetwork/darkpool-v1-proof';
import { DarkPool } from '../../darkpool';

import { getMerklePathAndRoot } from '../merkletree';
import { ethers } from 'ethers';
import OTCSwapAssetManagerAbi from '../../abis/OTCSwapAssetManager.json';

export interface OTCSwapAliceRequest {
  aliceNote: Note;
  aliceNoteNullier: bigint;
  aliceNewNoteRho: bigint;
  aliceNewNoteNote: bigint;
  aliceNewNoteFooter: bigint;
  aliceSignedMessage: string;

  bobNote: Note;
  bobNoteNullifier: bigint;
  bobNewNoteRho: bigint;
  bobNewNoteNote: bigint;
  bobNewNoteFooter: bigint;
  bobSignature: number[];
  bobPubKey: any;

  chainId: number;
}

export class otcSwapAliceService {
  private _darkPool: DarkPool;

  constructor(_darkPool: DarkPool) {
    this._darkPool = _darkPool;
  }

  private swapMessageToString(
    alicePubKey: { x: bigint; y: bigint },
    aliceOutNote: Note,
    aliceOutNoteNullifer: bigint,
    newAliceNoteFooter: bigint,
    newAliceNoteRho: bigint,
    chainId: number
  ) {
    return `ONEOFF-SWAP-INIT-${chainId}-${aliceOutNote.asset}-${aliceOutNote.amount}-${aliceOutNote.rho}-${aliceOutNote.note}-${aliceOutNoteNullifer}-${newAliceNoteFooter}-${newAliceNoteRho}-${alicePubKey.x}-${alicePubKey.y}`;
  }

  public async genOtcSwapAliceMessage(note: Note, signedMessage: string) {
    const [makerPubKey] = await generateKeyPair(signedMessage);
    const makerNoteRho = generateRho();
    const makerNoteFooter = getNoteFooter(makerNoteRho, makerPubKey);
    const makerNoteNullifier = calcNullifier(note.rho, makerPubKey);
    const swapMessage = this.swapMessageToString(
      makerPubKey,
      note,
      makerNoteNullifier,
      makerNoteFooter,
      makerNoteRho,
      this._darkPool.chainId
    );
    return swapMessage;
  }

  public async execute(request: OTCSwapAliceRequest) {
    const aliceMerkleInfo = await getMerklePathAndRoot(request.aliceNote.note, this._darkPool);
    const bobMerkleInfo = await getMerklePathAndRoot(request.bobNote.note, this._darkPool);

    const params: OTCSwapProofParam = {
      merkleRoot: aliceMerkleInfo.root,
      aliceMerkleIndex: aliceMerkleInfo.index,
      aliceMerklePath: aliceMerkleInfo.path,
      aliceNote: request.aliceNote,
      aliceNoteNullifier: request.aliceNoteNullier,
      newAliceNoteRho: request.aliceNewNoteRho,
      newAliceNoteNote: request.aliceNewNoteNote,
      newAliceNoteFooter: request.aliceNewNoteFooter,
      aliceSignedMessage: request.aliceSignedMessage,

      bobMerkleIndex: bobMerkleInfo.index,
      bobMerklePath: bobMerkleInfo.path,
      bobNote: request.bobNote,
      bobNoteNullifier: request.bobNoteNullifier,
      newBobRho: request.bobNewNoteRho,
      newBobNoteNote: request.bobNewNoteNote,
      newBobNoteFooter: request.bobNewNoteFooter,
      bobSignature: request.bobSignature,
      bobPubKey: request.bobPubKey
    };

    const proof = await generateOTCSwapProof(params);
    const signer = this._darkPool.signer;
    const contract = new ethers.Contract(
      this._darkPool.contracts.otcSwapAssetManager,
      OTCSwapAssetManagerAbi.abi,
      signer
    );

    const tx = await contract.swap(
      aliceMerkleInfo.root,
      proof.aliceNullifier,
      proof.aliceNewNote,
      proof.aliceNewNoteFooter,
      proof.bobNullifier,
      proof.bobNewNote,
      proof.bobNewNoteFooter,
      proof.proof.proof
    );

    return tx.hash;
  }
}
