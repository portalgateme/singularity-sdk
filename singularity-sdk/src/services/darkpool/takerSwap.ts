import { DarkPoolTakerSwapMessage, DarkPoolTakerSwapProofResult, Note, generateDarkPoolTakerSwapProof } from "@thesingularitynetwork/darkpool-v1-proof";
import { ethers } from "ethers";
import DarkPoolSwapAssetManagerAbi from '../../abis/DarkPoolSwapAssetManager.json';
import { DarkPool } from "../../darkpool";
import { DarkpoolError } from "../../entities";
import { BaseContext, BaseContractService } from "../BaseService";
import { multiGetMerklePathAndRoot } from "../merkletree";
import { hexlify32 } from "../../utils/util";

class TakerSwapContext extends BaseContext {
    private _proof?: DarkPoolTakerSwapProofResult;
    private _alceSwapMessage?: DarkPoolTakerSwapMessage;
    private _bobSwapMessage?: DarkPoolTakerSwapMessage;

    constructor(signature: string) {
        super(signature);
    }

    set proof(proof: DarkPoolTakerSwapProofResult | undefined) {
        this._proof = proof;
    }

    get proof(): DarkPoolTakerSwapProofResult | undefined {
        return this._proof;
    }

    set alceSwapMessage(swapMessage: DarkPoolTakerSwapMessage | undefined) {
        this._alceSwapMessage = swapMessage;
    }

    get alceSwapMessage(): DarkPoolTakerSwapMessage | undefined {
        return this._alceSwapMessage;
    }

    set bobSwapMessage(swapMessage: DarkPoolTakerSwapMessage | undefined) {
        this._bobSwapMessage = swapMessage;
    }

    get bobSwapMessage(): DarkPoolTakerSwapMessage | undefined {
        return this._bobSwapMessage;
    }
}

export class TakerSwapService extends BaseContractService<TakerSwapContext> {
    constructor(_darkPool?: DarkPool) {
        super(_darkPool);
    }

    public async prepare(aliceSwapMessage: DarkPoolTakerSwapMessage, bobSwapMessage: DarkPoolTakerSwapMessage): Promise<{ context: TakerSwapContext, outNotes: Note[] }> {

        const context = new TakerSwapContext('');
        context.alceSwapMessage = aliceSwapMessage;
        context.bobSwapMessage = bobSwapMessage;
        return { context, outNotes: [] };
    }

    public async generateProof(context: TakerSwapContext): Promise<void> {
        if (!context || !context.alceSwapMessage || !context.bobSwapMessage) {
            throw new DarkpoolError("Invalid context");
        }

        const merklePathes = await multiGetMerklePathAndRoot([context.alceSwapMessage.outNote.note, context.bobSwapMessage.outNote.note], this._darkPool);
        const path1 = merklePathes[0];
        const path2 = merklePathes[1];

        context.merkleRoot = path1.root;

        const proof = await generateDarkPoolTakerSwapProof({
            merkleRoot: path1.root,
            aliceMerkleIndex: path1.index,
            aliceMerklePath: path1.path,
            aliceMessage: context.alceSwapMessage,
            bobMerkleIndex: path2.index,
            bobMerklePath: path2.path,
            bobMessage: context.bobSwapMessage,
        });
        context.proof = proof;
    }

    public async execute(context: TakerSwapContext): Promise<string> {
        if (!context || !context.alceSwapMessage || !context.bobSwapMessage || !context.signature || !context.proof) {
            throw new DarkpoolError("Invalid context");
        }
        const signer = this._darkPool.signer;
        const contract = new ethers.Contract(this._darkPool.contracts.darkpoolSwapAssetManager, DarkPoolSwapAssetManagerAbi.abi, signer);
        const tx = await contract.takerSwap(
            context.proof.proof,
            [
                context.merkleRoot,
                context.proof.aliceOutNullifier,
                context.proof.aliceFeeAsset,
                context.proof.aliceFeeAmount,
                context.proof.aliceInNote,
                context.proof.aliceInNoteFooter,
                context.proof.bobOutNullifier,
                context.proof.bobFeeAsset,
                context.proof.bobFeeAmount,
                context.proof.bobInNote,
                context.proof.bobInNoteFooter
            ]
        );
        return tx.hash;
    }
}