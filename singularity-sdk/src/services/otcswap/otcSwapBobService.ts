import {
  calcNullifier,
  createNoteWithPubKey,
  DOMAIN_NOTE,
  generateKeyPair,
  generateOTCSwapSignature,
  getNoteFooter,
  Note
} from '@thesingularitynetwork/darkpool-v1-proof';

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

export class otcSwapBobService {
  constructor() {}

  private swapMessageToString(
    bobPubKey: { x: bigint; y: bigint },
    bobOutNote: Note,
    bobOutNoteNullifer: bigint,
    newBobNoteFooter: bigint,
    newBobNoteRho: bigint,
    bobSignature: number[],
    aliceSwapMessage: string
  ) {
    const aliceMessage = aliceSwapMessage.replace('ONEOFF-SWAP-INIT-', '');
    let sigString: string = '';

    for (let i = 0; i < bobSignature.length; i++) {
      sigString = sigString + '-' + bobSignature[i].toString();
    }

    return (
      `ONEOFF-SWAP-RETURN-${aliceMessage}-${bobOutNote.asset}-${bobOutNote.amount}-${bobOutNote.rho}-${bobOutNote.note}-${bobOutNoteNullifer}-${newBobNoteFooter}-${newBobNoteRho}-${bobPubKey.x}-${bobPubKey.y}` +
      `${sigString}`
    );
  }

  private async getNoteWithPubKey(rho: bigint, asset: string, amount: bigint, pubKey: any): Promise<Note> {
    const note = await createNoteWithPubKey(rho, asset, amount, pubKey, DOMAIN_NOTE);

    return {
      rho: note.rho,
      amount: note.amount,
      asset: note.asset,
      note: note.note
    };
  }

  public async genBobSwapMessage(
    aliceSwapMessage: string,
    aliceOutNote: Note,
    aliceOutNoteNullifier: bigint,
    aliceNewNoteFooter: bigint,
    aliceNewNoteRho: bigint,
    alicePubKey: { x: bigint; y: bigint },
    bobOutNote: Note,
    bobNewNote: Note,
    signedMessage: string
  ) {
    const [bobPubKey, bobPriKey] = await generateKeyPair(signedMessage);

    //const bobNewNote = await createNote(aliceOutNote.asset, aliceOutNote.amount, signedMessage)
    const aliceNewNote = await this.getNoteWithPubKey(
      aliceNewNoteRho,
      bobOutNote.asset,
      bobOutNote.amount,
      alicePubKey
    );

    const newBobNoteRho = bobNewNote.rho;
    const newBobNoteFooter: bigint = getNoteFooter(newBobNoteRho, bobPubKey);
    const bobNoteNullifier = calcNullifier(bobOutNote.rho, bobPubKey);

    const sig = await generateOTCSwapSignature(
      aliceOutNote.note,
      bobOutNote.note,
      aliceOutNoteNullifier,
      bobNoteNullifier,
      aliceNewNote.note,
      bobNewNote.note,
      aliceNewNoteFooter,
      newBobNoteFooter,
      bobPriKey
    );

    const swapMessage = this.swapMessageToString(
      bobPubKey,
      bobOutNote,
      bobNoteNullifier,
      newBobNoteFooter,
      newBobNoteRho,
      sig,
      aliceSwapMessage
    );

    return swapMessage;
  }
}
