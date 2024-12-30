import { createNote, darkPoolTakerCreateOrderProofResult, generateDarkPoolTakerCreateOrderProof, Note } from "@thesingularitynetwork/darkpool-v1-proof";
import { ethers } from "ethers";
import DarkpoolSwapAssetManagerAbi from '../../abis/DarkPoolSwapAssetManager.json';
import { DarkPool } from "../../darkpool";
import { DarkpoolError } from "../../entities";
import { BaseContext, BaseContractService } from "../BaseService";
import { getMerklePathAndRoot } from "../merkletree";


class CreateTakerOrderContext extends BaseContext {
    private _inNote?: Note;
    private _outNote?: Note;
    private _proof?: darkPoolTakerCreateOrderProofResult;
    private _feeAmount?: bigint;
    constructor(signature: string) {
        super(signature);
    }

    set inNote(note: Note | undefined) {
        this._inNote = note;
    }

    get inNote(): Note | undefined {
        return this._inNote;
    }

    set outNote(note: Note | undefined) {
        this._outNote = note;
    }

    get outNote(): Note | undefined {
        return this._outNote;
    }

    set proof(proof: darkPoolTakerCreateOrderProofResult | undefined) {
        this._proof = proof;
    }

    get proof(): darkPoolTakerCreateOrderProofResult | undefined {
        return this._proof;
    }

    set feeAmount(feeAmount: bigint | undefined) {
        this._feeAmount = feeAmount;
    }

    get feeAmount(): bigint | undefined {
        return this._feeAmount;
    }
}

export class CreateTakerOrderService extends BaseContractService<CreateTakerOrderContext> {

    constructor(_darkPool?: DarkPool) {
        super(_darkPool);
    }

    private async getFeeAmount(): Promise<bigint> {
        return 0n;//FIXME
    }

    public async prepare(inNote: Note, outAsset: string, outAmount: bigint, signature: string): Promise<{ context: CreateTakerOrderContext, outNotes: Note[] }> {
        const context = new CreateTakerOrderContext(signature);
        context.inNote = inNote;
        const feeAmount = await this.getFeeAmount();
        if (feeAmount >= outAmount) {
            throw new DarkpoolError("Fee amount is greater than out amount");
        }
        context.feeAmount = feeAmount;
        const outNote = await createNote(outAsset, outAmount - feeAmount, signature);
        context.outNote = outNote;
        return { context, outNotes: [outNote] };
    }

    public async generateProof(context: CreateTakerOrderContext): Promise<void> {
        if (!context || !context.inNote || !context.outNote || !context.feeAmount) {
            throw new DarkpoolError("Invalid context");
        }

        const merklePath = await getMerklePathAndRoot(context.inNote.note, this._darkPool);
        context.merkleRoot = merklePath.root;

        const proof = await generateDarkPoolTakerCreateOrderProof({
            merkleRoot: merklePath.root,
            merklePath: merklePath.path,
            merkleIndex: merklePath.index,
            inNote: context.outNote,
            outNote: context.inNote,
            feeAmount: context.feeAmount,
            signedMessage: context.signature,
        });
        context.proof = proof;
    }

    public async execute(context: CreateTakerOrderContext) {
        if (!context || !context.inNote || !context.proof || !context.merkleRoot) {
            throw new DarkpoolError("Invalid context");
        }

        const contract = new ethers.Contract(this._darkPool.contracts.darkpoolSwapAssetManager, DarkpoolSwapAssetManagerAbi.abi, this._darkPool.signer);
        const tx = await contract.takerCreateOrder(
            context.merkleRoot,
            context.proof.outNullifier,
            context.proof.feeAsset,
            context.proof.feeAmount,
            context.proof.inNote,
            context.proof.inNoteFooter,
            context.proof.proof);
        return tx;
    }
}