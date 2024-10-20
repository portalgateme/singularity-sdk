import { DOMAIN_NOTE, Note, OTCSwapProofResult, createNoteWithPubKey, generateOTCSwapProof } from "@thesingularitynetwork/darkpool-v1-proof";
import { ethers } from "ethers";
import OTCSwapAssetManagerAbi from '../../abis/OTCSwapAssetManager.json';
import { darkPool } from "../../darkpool";
import { DarkpoolError, Order, OTCSwapFullMessage } from "../../entities";
import { BaseContext, BaseContractService } from "../BaseService";
import { multiGetMerklePathAndRoot } from "../merkletree";
import { fullSwapSecretFromString } from "./otcSwapDepositService";
import { isAddressEquals } from "../../utils/util";



class OTCSwapContext extends BaseContext {
    private _note?: Note;
    private _address?: string;
    private _proof?: OTCSwapProofResult;
    private _swapMessage?: OTCSwapFullMessage;

    constructor(signature: string) {
        super(signature);
    }

    set note(note: Note | undefined) {
        this._note = note;
    }

    get note(): Note | undefined {
        return this._note;
    }

    set address(address: string | undefined) {
        this._address = address;
    }

    get address(): string | undefined {
        return this._address;
    }

    set proof(proof: OTCSwapProofResult | undefined) {
        this._proof = proof;
    }

    get proof(): OTCSwapProofResult | undefined {
        return this._proof;
    }

    set swapMessage(swapMessage: OTCSwapFullMessage | undefined) {
        this._swapMessage = swapMessage;
    }

    get swapMessage(): OTCSwapFullMessage | undefined {
        return this._swapMessage;
    }
}

export class OTCSwapService extends BaseContractService<OTCSwapContext> {
    constructor() {
        super();
    }

    private checkFullSwapSecret(partialSwapMessage: OTCSwapFullMessage, order: Order): boolean {
        if (partialSwapMessage.chainId !== darkPool.chainId) {
            return false;
        }

        if (order.orderId != partialSwapMessage.orderId) {
            return false;
        }

        if (!isAddressEquals(order.makerAsset, partialSwapMessage.makerNote.asset)
            || !isAddressEquals(order.takerAsset, partialSwapMessage.takerNote.asset)
        ) {
            return false;
        }

        if (order.makerAmount != partialSwapMessage.makerNote.amount
            || order.takerAmount != partialSwapMessage.takerNote.amount
        ) {
            return false;
        }

        return true;
    }

    public async getMakerNewNoteAfterSwap(fullSwapMessageString: string): Promise<Note> {
        const fullSwapMessage = fullSwapSecretFromString(darkPool.chainId, fullSwapMessageString);
        const newMakerNote = await createNoteWithPubKey(
            fullSwapMessage.makerNewRho,
            fullSwapMessage.takerNote.asset,
            fullSwapMessage.takerNote.amount,
            fullSwapMessage.makerPubKey,
            DOMAIN_NOTE
        );
        return newMakerNote;
    }

    public async getTakerNewNoteAfterSwap(fullSwapMessageString: string): Promise<Note> {
        const fullSwapMessage = fullSwapSecretFromString(darkPool.chainId, fullSwapMessageString);
        const newTakerNote = await createNoteWithPubKey(
            fullSwapMessage.takerNewRho,
            fullSwapMessage.makerNote.asset,
            fullSwapMessage.makerNote.amount,
            fullSwapMessage.takerPubKey,
            DOMAIN_NOTE
        );
        return newTakerNote;
    }

    public async prepare(order: Order, fullSwapMessageString: string): Promise<{ context: OTCSwapContext, outNotes: Note[] }> {
        const fullSwapMessage = fullSwapSecretFromString(darkPool.chainId, fullSwapMessageString);
        if (!this.checkFullSwapSecret(fullSwapMessage, order)) {
            throw new DarkpoolError("Invalid full swap secret");
        }
        const context = new OTCSwapContext('');
        context.swapMessage = fullSwapMessage;
        return { context, outNotes: [] };
    }

    public async generateProof(context: OTCSwapContext): Promise<void> {
        if (!context || !context.swapMessage) {
            throw new DarkpoolError("Invalid context");
        }

        const merklePathes = await multiGetMerklePathAndRoot([context.swapMessage.makerNote.note, context.swapMessage.takerNote.note]);
        const path1 = merklePathes[0];
        const path2 = merklePathes[1];

        const makerNewNote = await createNoteWithPubKey(
            context.swapMessage.makerNewRho,
            context.swapMessage.takerNote.asset,
            context.swapMessage.takerNote.amount,
            context.swapMessage.makerPubKey,
            DOMAIN_NOTE
        )

        const takerNewNote = await createNoteWithPubKey(
            context.swapMessage.takerNewRho,
            context.swapMessage.makerNote.asset,
            context.swapMessage.makerNote.amount,
            context.swapMessage.takerPubKey,
            DOMAIN_NOTE
        )

        const proof = await generateOTCSwapProof({
            merkleRoot: path1.root,
            aliceMerkleIndex: path1.index,
            aliceMerklePath: path1.path,
            aliceNote: context.swapMessage.makerNote,
            aliceNoteNullifier: context.swapMessage.makerNoteNullifier,
            newAliceNoteRho: makerNewNote.rho,
            newAliceNoteNote: makerNewNote.note,
            newAliceNoteFooter: makerNewNote.footer,
            aliceSignedMessage: context.signature,

            bobMerkleIndex: path2.index,
            bobMerklePath: path2.path,
            bobNote: context.swapMessage.takerNote,
            bobNoteNullifier: context.swapMessage.takerNoteNullifier,
            newBobRho: takerNewNote.rho,
            newBobNoteNote: takerNewNote.note,
            newBobNoteFooter: takerNewNote.footer,
            bobSignature: context.swapMessage.takerSignature,
            bobPubKey: context.swapMessage.takerPubKey,
        });
        context.proof = proof;
    }

    public async execute(context: OTCSwapContext): Promise<string> {
        if (!context || !context.note || !context.address || !context.signature || !context.proof) {
            throw new DarkpoolError("Invalid context");
        }
        const signer = darkPool.signer;
        const contract = new ethers.Contract(darkPool.contracts.otcSwapAssetManager, OTCSwapAssetManagerAbi.abi, signer);
        const tx = await contract.swap(
            context.merkleRoot,
            context.proof.aliceNullifier,
            context.proof.aliceNewNote,
            context.proof.aliceNewNoteFooter,
            context.proof.bobNullifier,
            context.proof.bobNewNote,
            context.proof.bobNewNoteFooter,
            context.proof.proof.proof
        );
        return tx.hash;
    }
}