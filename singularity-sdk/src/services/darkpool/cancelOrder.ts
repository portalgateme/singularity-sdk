import { darkPoolCancelOrderProofResult, darkPoolMakerCreateOrderProofResult, generateDarkPoolCancelOrderProof, Note } from "@thesingularitynetwork/darkpool-v1-proof";
import { ethers } from "ethers";
import DarkpoolSwapAssetManagerAbi from '../../abis/DarkPoolSwapAssetManager.json';
import { DarkPool } from "../../darkpool";
import { DarkpoolError } from "../../entities";
import { BaseContext, BaseContractService } from "../BaseService";
import { getMerklePathAndRoot } from "../merkletree";


class CancelOrderContext extends BaseContext{
    private _outgoingNote?: Note;
    private _proof?: darkPoolCancelOrderProofResult;

    constructor(signature: string) {
        super(signature);
    }

    set outgoingNote(note: Note | undefined) {
        this._outgoingNote = note;
    }

    get outgoingNote(): Note | undefined {
        return this._outgoingNote;
    }

    set proof(proof: darkPoolCancelOrderProofResult | undefined) {
        this._proof = proof;
    }

    get proof(): darkPoolMakerCreateOrderProofResult | undefined {
        return this._proof;
    }
}

export class CancelOrderService extends BaseContractService<CancelOrderContext> {

    constructor(_darkPool: DarkPool) {
        super(_darkPool);
    }

    public async prepare(outgoingNote: Note, signature: string): Promise<{ context: CancelOrderContext, outNotes: Note[] }> {
        const context = new CancelOrderContext(signature);
        context.outgoingNote = outgoingNote;
        return { context, outNotes: [] };
    }

    public async generateProof(context: CancelOrderContext): Promise<void> {
        if (!context || !context.outgoingNote) {
            throw new DarkpoolError("Invalid context");
        }

        const merklePath = await getMerklePathAndRoot(context.outgoingNote.note, this._darkPool);
        context.merkleRoot = merklePath.root;

        const proof = await generateDarkPoolCancelOrderProof({
            merkleRoot: merklePath.root,
            merklePath: merklePath.path,
            merkleIndex: merklePath.index,
            outNote: context.outgoingNote,
            signedMessage: context.signature,
        });
        context.proof = proof;
    }

    public async execute(context: CancelOrderContext): Promise<string> {
        if (!context || !context.outgoingNote || !context.proof || !context.merkleRoot) {
            throw new DarkpoolError("Invalid context");
        }
        const contract = new ethers.Contract(this._darkPool.contracts.darkpoolSwapAssetManager, DarkpoolSwapAssetManagerAbi.abi, this._darkPool.signer);
        const tx = await contract.cancelOrder(
            context.merkleRoot,
            context.proof.outNullifier,
            context.proof.proof);
        return tx.hash;
    }
}