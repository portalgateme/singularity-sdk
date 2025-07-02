import {
  calcNullifier,
  createNoteWithPubKey,
  DOMAIN_NOTE,
  generateKeyPair,
  generateOTCSwapSignature,
  getNoteFooter,
  Note
} from '@thesingularitynetwork/darkpool-v1-proof';
import { OTCSwapReturnMessage } from './types';

export class otcSwapBobService {
  constructor() {}

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

    const swapMessage: OTCSwapReturnMessage = {
      pubkey: bobPubKey,
      outNote: bobOutNote,
      outNoteNullifer: bobNoteNullifier,
      newNoteFooter: newBobNoteFooter,
      newNoteRho: newBobNoteRho,
      signature: sig
    };

    return swapMessage;
  }
}
