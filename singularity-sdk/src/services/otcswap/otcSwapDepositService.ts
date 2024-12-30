import { calcNullifier, createNoteWithFooter, createNoteWithPubKey, DOMAIN_NOTE, generateKeyPair, generateOTCSwapSignature, Note } from "@thesingularitynetwork/darkpool-v1-proof";
import { DarkpoolError, Order, OTCSwapFullMessage, OTCSwapMakerMessage } from "../../entities";
import { isAddressEquals } from "../../utils/util";
import { BaseContext } from "../BaseService";
import { DepositContext, DepositService } from "../base";
import { darkPool, DarkPool } from "../../darkpool";
class OTCSwapMakerDepositContext extends BaseContext {
    private _noteToDeposit: Note;
    private _partialSwapSecret: string;
    private _depositContext: DepositContext;

    constructor(signature: string, depositContext: DepositContext, partialSwapSecret: string, noteToDeposit: Note) {
        super(signature);
        this._depositContext = depositContext;
        this._partialSwapSecret = partialSwapSecret;
        this._noteToDeposit = noteToDeposit;
    }

    get noteToDeposit(): Note {
        return this._noteToDeposit;
    }

    get partialSwapSecret(): string {
        return this._partialSwapSecret;
    }

    get depositContext(): DepositContext {
        return this._depositContext;
    }
}

class OTCSwapTakerDepositContext extends BaseContext {
    private _noteToDeposit: Note;
    private _partialSwapSecret: string;
    private _depositContext: DepositContext;

    constructor(signedMessage: string, depositContext: DepositContext, partialSwapSecret: string, noteToDeposit: Note) {
        super(signedMessage);
        this._depositContext = depositContext;
        this._partialSwapSecret = partialSwapSecret;
        this._noteToDeposit = noteToDeposit;
    }

    get noteToDeposit(): Note {
        return this._noteToDeposit;
    }

    get partialSwapSecret(): string {
        return this._partialSwapSecret;
    }

    get depositContext(): DepositContext {
        return this._depositContext;
    }
}

function partialSwapSecretToString(partialSwapMessage: OTCSwapMakerMessage): string {
    const messageArray = [
        'ONEOFF-SWAP-INIT',
        partialSwapMessage.chainId,
        partialSwapMessage.makerNote.asset,
        partialSwapMessage.makerNote.amount,
        partialSwapMessage.makerNote.rho,
        partialSwapMessage.makerNote.note,
        partialSwapMessage.makerNoteNullifier,
        partialSwapMessage.makerNewFooter,
        partialSwapMessage.makerNewRho,
        partialSwapMessage.makerPubKey.x,
        partialSwapMessage.makerPubKey.y,
        partialSwapMessage.orderId
    ];

    return messageArray.join('|');
}

function partialSwapSecretFromString(
    chainId: number,
    messageString: string
): OTCSwapMakerMessage {
    const messageArray = messageString.split('|');
    const chainIdInMessage = messageArray[1];
    if (chainIdInMessage !== chainId.toString()) {
        throw new DarkpoolError('Chain ID mismatch');
    }
    const asset = messageArray[2];
    const amount = messageArray[3];
    const rho = messageArray[4];
    const note = messageArray[5];
    const nullifier = messageArray[6];
    const nweFooter = messageArray[7];
    const newRho = messageArray[8];
    const pubKeyX = messageArray[9];
    const pubKeyY = messageArray[10];
    const orderId = messageArray[11];
    return {
        chainId,
        makerNote: {
            asset,
            amount: BigInt(amount),
            rho: BigInt(rho),
            note: BigInt(note),
        },
        makerNoteNullifier: BigInt(nullifier),
        makerNewFooter: BigInt(nweFooter),
        makerNewRho: BigInt(newRho),
        makerPubKey: {
            x: BigInt(pubKeyX),
            y: BigInt(pubKeyY)
        },
        orderId
    }
}

function fullSwapSecretToString(finalSwapSecret: OTCSwapFullMessage): string {
    let sigString: string = finalSwapSecret.takerSignature.join('-')

    const messageArray = [
        'ONEOFF-SWAP-RETURN',
        finalSwapSecret.chainId,
        finalSwapSecret.makerNote.asset,
        finalSwapSecret.makerNote.amount,
        finalSwapSecret.makerNote.rho,
        finalSwapSecret.makerNote.note,
        finalSwapSecret.makerNoteNullifier,
        finalSwapSecret.makerNewFooter,
        finalSwapSecret.makerNewRho,
        finalSwapSecret.makerPubKey.x,
        finalSwapSecret.makerPubKey.y,
        finalSwapSecret.orderId,
        finalSwapSecret.takerNote.asset,
        finalSwapSecret.takerNote.amount,
        finalSwapSecret.takerNote.rho,
        finalSwapSecret.takerNote.note,
        finalSwapSecret.takerNoteNullifier,
        finalSwapSecret.takerNewFooter,
        finalSwapSecret.takerNewRho,
        finalSwapSecret.takerPubKey.x,
        finalSwapSecret.takerPubKey.y,
        sigString
    ];

    return messageArray.join('|');
}

export function fullSwapSecretFromString(chainId: number, messageString: string): OTCSwapFullMessage {
    const messageArray = messageString.split('|');
    const chainIdInMessage = messageArray[1];
    if (chainIdInMessage !== chainId.toString()) {
        throw new DarkpoolError('Chain ID mismatch');
    }

    const makerAsset = messageArray[2];
    const makerAmount = messageArray[3];
    const makerRho = messageArray[4];
    const makerNote = messageArray[5];
    const makerNoteNullifier = messageArray[6];
    const makerNewFooter = messageArray[7];
    const makerNewRho = messageArray[8];
    const makerPubKeyX = messageArray[9];
    const makerPubKeyY = messageArray[10];
    const orderId = messageArray[11];
    const takerAsset = messageArray[12];
    const takerAmount = messageArray[13];
    const takerRho = messageArray[14];
    const takerNote = messageArray[15];
    const takerNoteNullifier = messageArray[16];
    const takerNewFooter = messageArray[17];
    const takerNewRho = messageArray[18];
    const takerPubKeyX = messageArray[19];
    const takerPubKeyY = messageArray[20];
    const takerSignatureString = messageArray[21];

    const takerSignatureStringArray = takerSignatureString.split('-');
    const takerSignature: number[] = [];
    for (let i = 0; i < takerSignatureStringArray.length; i++) {
        takerSignature.push(parseInt(takerSignatureStringArray[i]))
    }

    const result = {
        chainId,
        makerNote: {
            asset: makerAsset,
            amount: BigInt(makerAmount),
            rho: BigInt(makerRho),
            note: BigInt(makerNote),
        },
        makerNoteNullifier: BigInt(makerNoteNullifier),
        makerNewFooter: BigInt(makerNewFooter),
        makerNewRho: BigInt(makerNewRho),
        makerPubKey: {
            x: BigInt(makerPubKeyX),
            y: BigInt(makerPubKeyY)
        },
        orderId,
        takerNote: {
            asset: takerAsset,
            amount: BigInt(takerAmount),
            rho: BigInt(takerRho),
            note: BigInt(takerNote),
        },
        takerNoteNullifier: BigInt(takerNoteNullifier),
        takerNewFooter: BigInt(takerNewFooter),
        takerNewRho: BigInt(takerNewRho),
        takerPubKey: {
            x: BigInt(takerPubKeyX),
            y: BigInt(takerPubKeyY)
        },
        takerSignature
    }

    return result;
}


export class OTCSwapDepositService {

    private _darkPool: DarkPool

    constructor(_darkPool?: DarkPool) {
        this._darkPool = _darkPool || darkPool
    }

    private async generateMakerSwapMessage(chainId: number, order: Order, note: Note, signedMessage: string): Promise<string> {
        const [makerPublicKey] = await generateKeyPair(signedMessage);
        const makerNewNote = await createNoteWithFooter(order.takerAmount, order.takerAsset, signedMessage);
        const makerNullifier = calcNullifier(note.rho, makerPublicKey);

        return partialSwapSecretToString({
            chainId,
            makerNote: note,
            makerNoteNullifier: makerNullifier,
            makerNewFooter: makerNewNote.footer,
            makerNewRho: makerNewNote.rho,
            makerPubKey: makerPublicKey,
            orderId: order.orderId
        });
    }

    public async prepareMakerAsset(order: Order, walletAddress: string, signedMessage: string): Promise<{ partialSwapSecret: string, context: OTCSwapMakerDepositContext }> {
        const depositService = new DepositService();
        const { context: depositContext, outNotes: [note] } = await depositService.prepare(order.makerAsset, order.makerAmount, walletAddress, signedMessage);
        const partialSwapSecret = await this.generateMakerSwapMessage(this._darkPool.chainId, order, note, signedMessage);
        const context = new OTCSwapMakerDepositContext(signedMessage, depositContext, partialSwapSecret, note);
        return { partialSwapSecret, context };
    }

    public async depositMakerAsset(context: OTCSwapMakerDepositContext): Promise<string> {
        const depositService = new DepositService();
        await depositService.generateProof(context.depositContext);
        const txId = await depositService.execute(context.depositContext);
        return txId;
    }

    private checkPartialSwapSecret(partialSwapMessage: OTCSwapMakerMessage, order: Order): boolean {
        if (partialSwapMessage.chainId !== this._darkPool.chainId) {
            return false;
        }

        if (order.orderId != partialSwapMessage.orderId) {
            return false;
        }

        if (!isAddressEquals(order.makerAsset, partialSwapMessage.makerNote.asset)) {
            return false;
        }

        if (order.makerAmount != partialSwapMessage.makerNote.amount) {
            return false;
        }

        return true;
    }

    private async generateTakerSwapMessage(order: Order, partialSwapMessage: OTCSwapMakerMessage, takerNote: Note, signedMessage: string): Promise<string> {
        const makerNewNote = await createNoteWithPubKey(
            partialSwapMessage.makerNewRho,
            order.takerAsset,
            order.takerAmount,
            partialSwapMessage.makerPubKey,
            DOMAIN_NOTE);
        const [takerPublicKey, takerPrivateKey] = await generateKeyPair(signedMessage);
        const takerNewNote = await createNoteWithFooter(order.makerAmount, order.makerAsset, signedMessage);
        const takerNullifier = calcNullifier(takerNote.rho, takerPublicKey);
        const takerSignature = await generateOTCSwapSignature(
            partialSwapMessage.makerNote.note,
            takerNote.note,
            partialSwapMessage.makerNoteNullifier,
            takerNullifier,
            makerNewNote.note,
            takerNewNote.note,
            makerNewNote.footer,
            takerNewNote.footer,
            takerPrivateKey);

        return fullSwapSecretToString({
            ...partialSwapMessage,
            takerNote,
            takerNoteNullifier: takerNullifier,
            takerNewFooter: takerNewNote.footer,
            takerNewRho: takerNewNote.rho,
            takerPubKey: takerPublicKey,
            takerSignature
        });
    }

    public async prepareTakerAsset(order: Order, partialSwapSecret: string, walletAddress: string, signedMessage: string): Promise<{ finalSwapSecret: string, context: OTCSwapTakerDepositContext }> {
        const partialSwapMessage = partialSwapSecretFromString(this._darkPool.chainId, partialSwapSecret);
        if (!this.checkPartialSwapSecret(partialSwapMessage, order)) {
            throw new DarkpoolError('Partial swap secret does not match the current order');
        }
        const depositService = new DepositService();
        const { context: depositContext, outNotes: [note] } = await depositService.prepare(order.takerAsset, order.takerAmount, walletAddress, signedMessage);
        const finalSwapSecret = await this.generateTakerSwapMessage(order, partialSwapMessage, note, signedMessage);
        const context = new OTCSwapTakerDepositContext(signedMessage, depositContext, finalSwapSecret, note);
        return { finalSwapSecret, context };
    }

    public async depositTakerAsset(context: OTCSwapTakerDepositContext): Promise<string> {
        const depositService = new DepositService();
        await depositService.generateProof(context.depositContext);
        const txId = await depositService.execute(context.depositContext);
        return txId;
    }
}
