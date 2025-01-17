import { JoinProofResult, Note, createNote, generateJoinProof } from "@thesingularitynetwork/darkpool-v1-proof";
import { ethers } from "ethers";
import { hexlify32, isAddressEquals } from "../../utils/util";
import { multiGetMerklePathAndRoot } from "../merkletree";
import DarkpoolAssetManagerAbi from '../../abis/DarkpoolAssetManager.json'
import { BaseContext, BaseContractService } from "../BaseService";
import { DarkpoolError } from "../../entities";
import { DarkPool } from "../../darkpool";


class JoinContext extends BaseContext{
    private _inNote1?: Note;
    private _inNote2?: Note;
    private _outNote?: Note;
    private _proof?: JoinProofResult;

    constructor(signature: string) {
        super(signature);
    }

    set inNote1(note: Note | undefined) {
        this._inNote1 = note;
    }

    get inNote1(): Note | undefined {
        return this._inNote1;
    }

    set inNote2(note: Note | undefined) {
        this._inNote2 = note;
    }

    get inNote2(): Note | undefined {
        return this._inNote2;
    }

    set outNote(note: Note | undefined) {
        this._outNote = note;
    }

    get outNote(): Note | undefined {
        return this._outNote;
    }

    set proof(proof: JoinProofResult | undefined) {
        this._proof = proof;
    }

    get proof(): JoinProofResult | undefined {
        return this._proof;
    }
}

export class JoinService extends BaseContractService<JoinContext> {

    constructor(_darkPool?: DarkPool) {
        super(_darkPool);
    }

    public async prepare(inNote1: Note, inNote2: Note, signature: string): Promise<{ context: JoinContext, outNotes: Note[] }> {
        if (!isAddressEquals(inNote1.asset, inNote2.asset)) {
            throw new DarkpoolError("inNote1 and inNote2 must have the same asset");
        }

        if (inNote1.note === inNote2.note) {
            throw new DarkpoolError("inNote1 and inNote2 must have different note");
        }

        const outNote = await createNote(inNote1.asset, inNote1.amount + inNote2.amount, signature);
        const context = new JoinContext(signature);
        context.inNote1 = inNote1;
        context.inNote2 = inNote2;
        context.outNote = outNote;
        return { context, outNotes: [outNote] };
    }

    public async generateProof(context: JoinContext): Promise<void> {
        if (!context || !context.inNote1 || !context.inNote2 || !context.outNote) {
            throw new DarkpoolError("Invalid context");
        }

        const merklePathes = await multiGetMerklePathAndRoot([context.inNote1.note, context.inNote2.note], this._darkPool);
        const path1 = merklePathes[0];
        const path2 = merklePathes[1];

        const proof = await generateJoinProof({
            inNote1: context.inNote1,
            inNote2: context.inNote2,
            outNote: context.outNote,
            merkleRoot: path1.root,
            note1MerklePath: path1.path,
            note1MerkleIndex: path1.index,
            note2MerklePath: path2.path,
            note2MerkleIndex: path2.index,
            signedMessage: context.signature,
        });
        context.proof = proof;
    }

    public async execute(context: JoinContext): Promise<string> {
        if (!context || !context.inNote1 || !context.inNote2 || !context.outNote || !context.proof) {
            throw new DarkpoolError("Invalid context");
        }

        const contract = new ethers.Contract(this._darkPool.contracts.darkpoolAssetManager, DarkpoolAssetManagerAbi.abi, this._darkPool.signer);
        const tx = await contract.join(
            context.proof.inNoteNullifier1,
            context.proof.inNoteNullifier2,
            hexlify32(context.outNote.note),
            context.proof.outNoteFooter,
            context.proof.proof.proof);
        return tx;
    }
}