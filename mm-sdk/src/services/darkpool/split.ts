import { Note, SplitProofResult, createNote, generateSplitProof } from "@thesingularitynetwork/darkpool-v1-proof";
import { ethers } from "ethers";
import DarkpoolAssetManagerAbi from '../../abis/DarkpoolAssetManager.json';
import { darkPool } from "../../darkpool";
import { hexlify32 } from "../../utils/util";
import { getMerklePathAndRoot } from "../merkletree";
import { BaseContext, BaseContractService } from "../BaseService";
import { DarkpoolError } from "../../entities";


class SplitContext extends BaseContext{
    private _inNote?: Note;
    private _outNote1?: Note;
    private _outNote2?: Note;
    private _proof?: SplitProofResult;

    constructor(signature: string) {
        super(signature);
    }

    set inNote(note: Note | undefined) {
        this._inNote = note;
    }

    get inNote(): Note | undefined {
        return this._inNote;
    }

    set outNote1(note: Note | undefined) {
        this._outNote1 = note;
    }

    get outNote1(): Note | undefined {
        return this._outNote1;
    }

    set outNote2(note: Note | undefined) {
        this._outNote2 = note;
    }

    get outNote2(): Note | undefined {
        return this._outNote2;
    }

    set proof(proof: SplitProofResult | undefined) {
        this._proof = proof;
    }

    get proof(): SplitProofResult | undefined {
        return this._proof;
    }

}

export class SplitService extends BaseContractService<SplitContext> {
    constructor() {
        super();
    }

    public async prepare(inNote: Note, outAmount1: bigint, signature: string): Promise<{ context: SplitContext, outNotes: Note[] }> {
        if (outAmount1 >= inNote.amount || outAmount1 <= 0n) {
            throw new DarkpoolError("Invalid amount");
        }
        const outAmount2 = inNote.amount - outAmount1;

        const outNote1 = await createNote(inNote.asset, outAmount1, signature);
        const outNote2 = await createNote(inNote.asset, outAmount2, signature);
        const context = new SplitContext(signature);
        context.inNote = inNote;
        context.outNote1 = outNote1;
        context.outNote2 = outNote2;
        return { context, outNotes: [outNote1, outNote2] };
    }

    public async generateProof(context: SplitContext): Promise<void> {
        if (!context || !context.inNote || !context.outNote1 || !context.outNote2 || !context.signature) {
            throw new DarkpoolError("Invalid context");
        }

        const path = await getMerklePathAndRoot(context.inNote.note);
        context.merkleRoot = path.root;

        const proof = await generateSplitProof({
            inNote: context.inNote,
            outNote1: context.outNote1,
            outNote2: context.outNote2,
            merkleRoot: path.root,
            merklePath: path.path,
            merkleIndex: path.index,
            signedMessage: context.signature,
        });
        context.proof = proof;
    }

    public async execute(context: SplitContext) {
        if (!context || !context.inNote || !context.outNote1 || !context.outNote2 || !context.signature || !context.proof) {
            throw new DarkpoolError("Invalid context");
        }

        const provider = darkPool.provider;
        const contract = new ethers.Contract(darkPool.contracts.darkpoolAssetManager, DarkpoolAssetManagerAbi.abi, provider);
        const tx = await contract.split(
            context.merkleRoot,
            context.proof.inNoteNullifier,
            hexlify32(context.outNote1.note),
            hexlify32(context.outNote2.note),
            context.proof.outNoteFooter1,
            context.proof.outNoteFooter2,
            context.proof.proof);
        return tx;
    }
}