import { BatchJoinSplitProofResult, Note, createNote, generateBatchJoinSplitProof, EMPTY_NOTE } from "@thesingularitynetwork/darkpool-v1-proof";
import { ethers } from "ethers";
import BatchJoinSplitAssetManagerAbi from '../../abis/BatchJoinSplitAssetManager.json';
import { DarkPool } from "../../darkpool";
import { hexlify32, isAddressEquals } from "../../utils/util";
import { BaseContext, BaseContractService } from "../BaseService";
import { MerklePath, multiGetMerklePathAndRoot } from "../merkletree";
import { DarkpoolError } from "../../entities";


class BatchJoinSplitContext extends BaseContext {
    private _inNotes?: Note[];
    private _outNotes?: Note[];
    private _proof?: BatchJoinSplitProofResult;

    constructor(signature: string) {
        super(signature);
    }

    set inNotes(notes: Note[] | undefined) {
        this._inNotes = notes;
    }

    get inNotes(): Note[] | undefined {
        return this._inNotes;
    }

    set outNotes(notes: Note[] | undefined) {
        this._outNotes = notes;
    }

    get outNotes(): Note[] | undefined {
        return this._outNotes;
    }


    set proof(proof: BatchJoinSplitProofResult | undefined) {
        this._proof = proof;
    }

    get proof(): BatchJoinSplitProofResult | undefined {
        return this._proof;
    }
}

export class BatchJoinSplitService extends BaseContractService<BatchJoinSplitContext> {
    constructor(_darkPool: DarkPool) {
        super(_darkPool);
    }

    public async prepare(inNotes: Note[], outAmount1: bigint, signature: string): Promise<{ context: BatchJoinSplitContext, outNotes: Note[] }> {
        // Check input parameters
        if (!inNotes || inNotes.length === 0) {
            throw new DarkpoolError("Invalid input notes");
        }

        // Check if number of input notes exceeds 5
        if (inNotes.length > 5) {
            throw new DarkpoolError("Too many input notes, maximum is 5");
        }

        // Verify all input notes have the same asset
        const asset = inNotes[0].asset;
        if (!inNotes.every(note => isAddressEquals(note.asset, asset))) {
            throw new DarkpoolError("All input notes must have the same asset");
        }

        // Check for duplicate input notes
        const noteSet = new Set(inNotes.map(note => note.note.toString()));
        if (noteSet.size !== inNotes.length) {
            throw new DarkpoolError("Duplicate input notes are not allowed");
        }

        // Calculate total input amount
        const totalInAmount = inNotes.reduce((sum, note) => sum + note.amount, 0n);

        // Validate outAmount1
        if (outAmount1 <= 0n || outAmount1 > totalInAmount) {
            throw new DarkpoolError("Invalid outAmount1");
        }

        // Create output notes
        const outNotes: Note[] = [];

        // Create first output note
        const outNote1 = await createNote(asset, outAmount1, signature);
        outNotes.push(outNote1);

        // Calculate remaining amount and create second output note if needed
        const remainingAmount = totalInAmount - outAmount1;
        if (remainingAmount > 0n) {
            const outNote2 = await createNote(asset, remainingAmount, signature);
            outNotes.push(outNote2);
        }

        // Create context
        const context = new BatchJoinSplitContext(signature);
        context.inNotes = inNotes;

        context.outNotes = outNotes;

        return {
            context,
            outNotes
        };
    }

    public async generateProof(context: BatchJoinSplitContext): Promise<void> {
        if (!context || !context.inNotes || !context.outNotes || !context.signature) {
            throw new DarkpoolError("Invalid context");
        }

        // Ensure there are enough input notes
        if (context.inNotes.length < 2) {
            throw new DarkpoolError("At least 2 input notes are required");
        }

        // Get merkle paths for actual input notes
        const merklePathes = await multiGetMerklePathAndRoot(context.inNotes.map(note => note.note), this._darkPool);

        // Create empty merkle path for empty notes
        const emptyMerklePath: MerklePath = {
            path: Array(32).fill(hexlify32(0n)),
            index: Array(32).fill(0),
            root: merklePathes[0].root, // Use the same root
            noteCommitment: EMPTY_NOTE.note
        };

        // Prepare input notes array (fill with EMPTY_NOTE if less than 5)
        const inNotes = [...context.inNotes];
        while (inNotes.length < 5) {
            inNotes.push(EMPTY_NOTE);
        }

        // Prepare merkle paths array (fill with empty paths if needed)
        const merklePaths = [...merklePathes];
        while (merklePaths.length < 5) {
            merklePaths.push(emptyMerklePath);
        }

        const proof = await generateBatchJoinSplitProof({
            inNote1: inNotes[0],
            inNote2: inNotes[1],
            inNote3: inNotes[2],
            inNote4: inNotes[3],
            inNote5: inNotes[4],
            outNote1: context.outNotes[0],
            outNote2: context.outNotes[1] || EMPTY_NOTE,
            merkleRoot: merklePaths[0].root,
            note1MerklePath: merklePaths[0].path,
            note1MerkleIndex: merklePaths[0].index,
            note2MerklePath: merklePaths[1].path,
            note2MerkleIndex: merklePaths[1].index,
            note3MerklePath: merklePaths[2].path,
            note3MerkleIndex: merklePaths[2].index,
            note4MerklePath: merklePaths[3].path,
            note4MerkleIndex: merklePaths[3].index,
            note5MerklePath: merklePaths[4].path,
            note5MerkleIndex: merklePaths[4].index,
            signedMessage: context.signature,
        });
        context.proof = proof;
        context.merkleRoot = merklePaths[0].root;
    }

    public async execute(context: BatchJoinSplitContext): Promise<string> {
        if (!context || !context.merkleRoot || !context.inNotes || !context.outNotes || !context.signature || !context.proof) {
            throw new DarkpoolError("Invalid context");
        }

        const contract = new ethers.Contract(this._darkPool.contracts.batchJoinSplitAssetManager, BatchJoinSplitAssetManagerAbi.abi, this._darkPool.signer);
        const tx = await contract.batchJoinSplit(
            context.merkleRoot,
            [
                context.proof.inNoteNullifier1,
                context.proof.inNoteNullifier2,
                context.proof.inNoteNullifier3,
                context.proof.inNoteNullifier4,
                context.proof.inNoteNullifier5
            ],
            [
                hexlify32(context.outNotes[0].note),
                context.outNotes.length > 1 ? hexlify32(context.outNotes[1].note) : hexlify32(EMPTY_NOTE.note)
            ],
            [
                context.proof.outNoteFooter1,
                context.proof.outNoteFooter2
            ],
            context.proof.proof.proof);
        return tx.hash;
    }
}
