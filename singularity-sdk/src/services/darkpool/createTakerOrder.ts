import { createNote, DarkPoolTakerCreateOrderProofResult, DarkPoolTakerSwapMessage, generateDarkPoolTakerCreateOrderProof, Note, generateDarkPoolTakerSwapMessage } from "@thesingularitynetwork/darkpool-v1-proof";
import { ethers } from "ethers";
import DarkpoolSwapAssetManagerAbi from '../../abis/DarkPoolSwapAssetManager.json';
import { DarkPool } from "../../darkpool";
import { DarkpoolError } from "../../entities";
import { BaseContext, BaseContractService } from "../BaseService";
import { getMerklePathAndRoot } from "../merkletree";


class CreateTakerOrderContext extends BaseContext {
    private _outgoingNote?: Note;
    private _incomingNote?: Note;
    private _proof?: DarkPoolTakerCreateOrderProofResult;
    private _feeAmount?: bigint;
    private _takerSwapMessage?: DarkPoolTakerSwapMessage;

    constructor(signature: string) {
        super(signature);
    }

    set incomingNote(note: Note | undefined) {
        this._incomingNote = note;
    }

    get incomingNote(): Note | undefined {
        return this._incomingNote;
    }

    set outgoingNote(note: Note | undefined) {
        this._outgoingNote = note;
    }

    get outgoingNote(): Note | undefined {
        return this._outgoingNote;
    }

    set proof(proof: DarkPoolTakerCreateOrderProofResult | undefined) {
        this._proof = proof;
    }

    get proof(): DarkPoolTakerCreateOrderProofResult | undefined {
        return this._proof;
    }

    set feeAmount(feeAmount: bigint | undefined) {
        this._feeAmount = feeAmount;
    }

    get feeAmount(): bigint | undefined {
        return this._feeAmount;
    }

    set takerSwapMessage(takerSwapMessage: DarkPoolTakerSwapMessage | undefined) {
        this._takerSwapMessage = takerSwapMessage;
    }

    get takerSwapMessage(): DarkPoolTakerSwapMessage | undefined {
        return this._takerSwapMessage;
    }
}

export class CreateTakerOrderService extends BaseContractService<CreateTakerOrderContext> {

    constructor(_darkPool: DarkPool) {
        super(_darkPool);
    }

    private async getFeeAmount(): Promise<bigint> {
        return 0n;//FIXME
    }

    public async prepare(outgoingNote: Note, incomingAsset: string, incomingAmount: bigint, signature: string): Promise<{ context: CreateTakerOrderContext, outNotes: Note[] }> {
        const context = new CreateTakerOrderContext(signature);
        context.outgoingNote = outgoingNote;
        const feeAmount = await this.getFeeAmount();
        if (feeAmount >= incomingAmount) {
            throw new DarkpoolError("Fee amount is greater than out amount");
        }
        context.feeAmount = feeAmount;
        const incomingNote = await createNote(incomingAsset, incomingAmount - feeAmount, signature);
        context.incomingNote = incomingNote;
        context.takerSwapMessage = await generateDarkPoolTakerSwapMessage({
            outNote: outgoingNote,
            inNote: incomingNote,
            feeAsset: incomingNote.asset,
            feeAmount: feeAmount,
            signedMessage: signature,
        });
        return { context, outNotes: [incomingNote] };
    }

    public async generateProof(context: CreateTakerOrderContext): Promise<void> {
        if (!context || !context.incomingNote || !context.outgoingNote || !context.feeAmount) {
            throw new DarkpoolError("Invalid context");
        }

        const merklePath = await getMerklePathAndRoot(context.outgoingNote.note, this._darkPool);
        context.merkleRoot = merklePath.root;

        const proof = await generateDarkPoolTakerCreateOrderProof({
            merkleRoot: merklePath.root,
            merklePath: merklePath.path,
            merkleIndex: merklePath.index,
            outNote: context.outgoingNote,
            inNote: context.incomingNote,
            feeAmount: context.feeAmount,
            signedMessage: context.signature,
        });
        context.proof = proof;
    }

    public async execute(context: CreateTakerOrderContext): Promise<string> {
        if (!context || !context.incomingNote || !context.proof || !context.merkleRoot) {
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
        return tx.hash;
    }
}