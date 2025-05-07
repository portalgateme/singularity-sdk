import { Note } from '@thesingularitynetwork/darkpool-v1-proof';

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

export interface OTCSwapBobRequest {
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

export interface OTCSwapMessage {
  pubkey: { x: bigint; y: bigint };
  outNote: Note;
  outNoteNullifer: bigint;
  newNoteFooter: bigint;
  newNoteRho: bigint;
}

export interface OTCSwapReturnMessage extends OTCSwapMessage {
  signature: number[];
}
