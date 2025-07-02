import { Note } from '@thesingularitynetwork/darkpool-v1-proof';

export type Order = {
  orderId: string;
  makerAsset: string;
  makerAmount: bigint;
  takerAsset: string;
  takerAmount: bigint;
};

export type OTCSwapMakerMessage = {
  chainId: number;
  orderId: string;
  makerNote: Note;
  makerNoteNullifier: bigint;
  makerNewFooter: bigint;
  makerNewRho: bigint;
  makerPubKey: { x: bigint; y: bigint };
};

export type OTCSwapFullMessage = OTCSwapMakerMessage & {
  takerNote: Note;
  takerNoteNullifier: bigint;
  takerNewFooter: bigint;
  takerNewRho: bigint;
  takerPubKey: { x: bigint; y: bigint };
  takerSignature: number[];
};
