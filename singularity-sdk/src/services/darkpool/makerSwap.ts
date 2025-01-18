import { DarkPoolMakerSwapProofResult, DarkPoolTakerSwapMessage, EMPTY_NOTE, Note, createNote, generateDarkPoolMakerSwapProof, generateDarkPoolTakerSwapMessage } from "@thesingularitynetwork/darkpool-v1-proof";
import { ethers } from "ethers";
import DarkPoolSwapAssetManagerAbi from '../../abis/DarkPoolSwapAssetManager.json';
import { DarkPool } from "../../darkpool";
import { DarkpoolError, Order } from "../../entities";
import { BaseContext, BaseContractService } from "../BaseService";
import { multiGetMerklePathAndRoot } from "../merkletree";
import { decryptWithPrivateKey, deserializeDarkPoolTakerSwapMessage, encryptWithPublicKey } from "../order/orderService";
import { serializeDarkPoolTakerSwapMessage } from "../order/orderService";

class MakerSwapContext extends BaseContext {
    private _aliceOutgoingNote?: Note;
    private _aliceChangeNote?: Note;
    private _aliceIncomingNote?: Note;
    private _order?: Order;
    private _proof?: DarkPoolMakerSwapProofResult;
    private _bobSwapMessage?: DarkPoolTakerSwapMessage;

    constructor(signature: string) {
        super(signature);
    }

    set proof(proof: DarkPoolMakerSwapProofResult | undefined) {
        this._proof = proof;
    }

    get proof(): DarkPoolMakerSwapProofResult | undefined {
        return this._proof;
    }

    set aliceOutgoingNote(note: Note | undefined) {
        this._aliceOutgoingNote = note;
    }

    get aliceOutgoingNote(): Note | undefined {
        return this._aliceOutgoingNote;
    }

    set aliceChangeNote(note: Note | undefined) {
        this._aliceChangeNote = note;
    }

    get aliceChangeNote(): Note | undefined {
        return this._aliceChangeNote;
    }

    set aliceIncomingNote(note: Note | undefined) {
        this._aliceIncomingNote = note;
    }

    get aliceIncomingNote(): Note | undefined {
        return this._aliceIncomingNote;
    }

    set order(order: Order | undefined) {
        this._order = order;
    }

    get order(): Order | undefined {
        return this._order;
    }

    set bobSwapMessage(swapMessage: DarkPoolTakerSwapMessage | undefined) {
        this._bobSwapMessage = swapMessage;
    }

    get bobSwapMessage(): DarkPoolTakerSwapMessage | undefined {
        return this._bobSwapMessage;
    }
}

export class MakerSwapService extends BaseContractService<MakerSwapContext> {
    constructor(_darkPool?: DarkPool) {
        super(_darkPool);
    }

    public async getFullMatchSwapMessage(order: Order, bobOutgoingNote: Note, signedMessage: string): Promise<{ incomingNote: Note, bobSwapMessage: DarkPoolTakerSwapMessage }> {
        const incomingNote = await createNote(order.makerAsset, order.makerAmount, signedMessage);
        const bobSwapMessage = await generateDarkPoolTakerSwapMessage({
            outNote: bobOutgoingNote,
            inNote: incomingNote,
            feeAsset: incomingNote.asset,
            feeAmount: 0n,
            signedMessage: signedMessage,
        });
        return { incomingNote, bobSwapMessage };
    }

    public async encryptSwapMessageWithPublicKey(swapMessage: DarkPoolTakerSwapMessage, alicePublicKey: string): Promise<string> {
        const encryptedMessage = await encryptWithPublicKey(alicePublicKey, serializeDarkPoolTakerSwapMessage(swapMessage));
        return encryptedMessage;
    }

    public async decryptSwapMessageWithPrivateKey(encryptedMessage: string, alicePrivateKey: string): Promise<DarkPoolTakerSwapMessage> {
        const decryptedMessage = await decryptWithPrivateKey(alicePrivateKey, encryptedMessage);
        return deserializeDarkPoolTakerSwapMessage(decryptedMessage);
    }

    public async prepare(order: Order, aliceOutgoingNote: Note, bobSwapMessage: DarkPoolTakerSwapMessage, signedMessage: string): Promise<{ context: MakerSwapContext, outNotes: Note[] }> {
        const context = new MakerSwapContext(signedMessage);
        context.aliceOutgoingNote = aliceOutgoingNote;
        context.bobSwapMessage = bobSwapMessage;

        const preparedNotes = [];
        const aliceIncomingNote = await createNote(
            bobSwapMessage.outNote.asset,
            bobSwapMessage.outNote.amount,
            signedMessage
        )
        preparedNotes.push(aliceIncomingNote);

        if (aliceOutgoingNote.amount > order.makerAmount) {
            const aliceChangeNote = await createNote(
                aliceOutgoingNote.asset,
                aliceOutgoingNote.amount - order.makerAmount,
                signedMessage
            )
            context.aliceChangeNote = aliceChangeNote;
            preparedNotes.push(aliceChangeNote);
        } else {
            context.aliceChangeNote = EMPTY_NOTE;
        }


        return { context, outNotes: preparedNotes };
    }

    public async generateProof(context: MakerSwapContext): Promise<void> {
        if (!context || !context.aliceOutgoingNote || !context.bobSwapMessage || !context.aliceIncomingNote || !context.aliceChangeNote) {
            throw new DarkpoolError("Invalid context");
        }

        const merklePathes = await multiGetMerklePathAndRoot([context.aliceOutgoingNote.note, context.bobSwapMessage.outNote.note], this._darkPool);
        const path1 = merklePathes[0];
        const path2 = merklePathes[1];

        context.merkleRoot = path1.root;


        const proof = await generateDarkPoolMakerSwapProof({
            merkleRoot: path1.root,
            aliceMerkleIndex: path1.index,
            aliceMerklePath: path1.path,
            aliceOutNote: context.aliceOutgoingNote,
            aliceChangeNote: context.aliceChangeNote,
            aliceInNote: context.aliceIncomingNote,
            aliceSignedMessage: context.signature,
            bobMerkleIndex: path2.index,
            bobMerklePath: path2.path,
            bobSwapMessage: context.bobSwapMessage,
        }
        )
        context.proof = proof;
    }

    public async execute(context: MakerSwapContext): Promise<string> {
        if (!context || !context.bobSwapMessage || !context.signature || !context.proof) {
            throw new DarkpoolError("Invalid context");
        }
        const signer = this._darkPool.signer;
        const contract = new ethers.Contract(this._darkPool.contracts.darkpoolSwapAssetManager, DarkPoolSwapAssetManagerAbi.abi, signer);
        const tx = await contract.makerSwap(
            context.proof.proof,
            [
                context.merkleRoot,
                context.proof.aliceOutNullifier,
                context.proof.aliceInNote,
                context.proof.aliceInNoteFooter,
                context.proof.aliceChangeNote,
                context.proof.aliceChangeNoteFooter,
                context.proof.bobOutNullifier,
                context.proof.bobFeeAsset,
                context.proof.bobFeeAmount,
                context.proof.bobInNote,
                context.proof.bobInNoteFooter,
            ]
        );
        return tx.hash;
    }
}