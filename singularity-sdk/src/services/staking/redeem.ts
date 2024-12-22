import { Note, PartialNote, createPartialNote, generateZkRedeemProof, recoverNoteWithFooter, zkRedeemProofResult } from "@thesingularitynetwork/darkpool-v1-proof";
import StakeAssetManagerAbi from "../../abis/StakingAssetManager.json";
import { Action, relayerPathConfig } from "../../config/config";
import { DarkpoolError, RedeemRelayerRequest, Relayer } from "../../entities";
import { hexlify32 } from "../../utils/util";
import { BaseRelayerContext, BaseRelayerService } from "../BaseService";
import { getOutEvent } from "../EventService";
import { getMerklePathAndRoot } from "../merkletree";
import { getOriginalTokenFromZkToken } from "./stakingUtils";
import { DarkPool } from "../../darkpool";

class RedeemContext extends BaseRelayerContext {
    private _inNote?: Note;
    private _outNotePartial?: PartialNote;
    private _proof?: zkRedeemProofResult;

    constructor(relayer: Relayer, signature: string) {
        super(relayer, signature);
    }

    set inNote(inAsset: Note | undefined) {
        this._inNote = inAsset;
    }

    get inNote(): Note | undefined {
        return this._inNote;
    }

    set outNotePartial(note: PartialNote | undefined) {
        this._outNotePartial = note;
    }

    get outNotePartial(): PartialNote | undefined {
        return this._outNotePartial;
    }

    set proof(proof: zkRedeemProofResult | undefined) {
        this._proof = proof;
    }

    get proof(): zkRedeemProofResult | undefined {
        return this._proof;
    }
}

export class RedeemService extends BaseRelayerService<RedeemContext, RedeemRelayerRequest> {
    constructor(_darkPool?: DarkPool) {
        super(_darkPool);
    }

    public async prepare(inNote: Note, signature: string): Promise<{ context: RedeemContext, outPartialNotes: PartialNote[] }> {
        const originalToken = await getOriginalTokenFromZkToken(this._darkPool, inNote.asset);
        if (!originalToken) {
            throw new DarkpoolError("The token is not supported in compliant staking: " + inNote.asset);
        }

        const outNotePartial = await createPartialNote(originalToken.address, signature);

        const context = new RedeemContext(this._darkPool.getRelayer(), signature);
        context.inNote = inNote;
        context.outNotePartial = outNotePartial;
        return { context, outPartialNotes: [outNotePartial] };
    }

    public async generateProof(context: RedeemContext): Promise<void> {
        if (
            !context
            || !context.inNote
            || !context.outNotePartial
            || !context.signature) {
            throw new DarkpoolError("Invalid context");
        }

        const path = await getMerklePathAndRoot(context.inNote.note, this._darkPool);
        context.merkleRoot = path.root;

        const proof = await generateZkRedeemProof({
            merkleRoot: path.root,
            merklePath: path.path,
            merkleIndex: path.index,
            inNote: context.inNote,
            outNotePartial: context.outNotePartial,
            relayer: context.relayer.relayerAddress,
            signedMessage: context.signature
        });
        context.proof = proof;
    }

    public async getRelayerRequest(context: RedeemContext): Promise<RedeemRelayerRequest> {
        if (!context
            || !context.inNote
            || !context.outNotePartial
            || !context.signature
            || !context.merkleRoot
            || !context.proof) {
            throw new DarkpoolError("Invalid context");
        }

        const relayerRequest: RedeemRelayerRequest = {
            inAmount: hexlify32(context.inNote.amount),
            inAsset: context.inNote.asset,
            inNullifier: context.proof.inNullifier,
            outNoteFooter: hexlify32(context.outNotePartial.footer),
            refund: hexlify32(0n),
            proof: context.proof.proof.proof,
            merkleRoot: context.merkleRoot,
            relayer: context.relayer.relayerAddress,
            verifierArgs: context.proof.proof.verifyInputs,
        };

        return relayerRequest;
    }

    public getRelayerPath(): string {
        return relayerPathConfig[Action.REDEEM];
    }

    public async postExecute(context: RedeemContext): Promise<Note[]> {
        if (!context
            || !context.outNotePartial
            || !context.signature
        ) {
            throw new DarkpoolError("Invalid context");
        }

        if (!context.tx) {
            throw new DarkpoolError("No transaction hash");
        }
        const event = await getOutEvent(context.tx, StakeAssetManagerAbi.abi, "Unlocked", this._darkPool);

        if (!event || !event.args || !event.args[2]) {
            throw new DarkpoolError("Can not find Unlocked Event from transaction: " + context.tx);
        }

        const outAmount = event.args[2];
        const outNote = await recoverNoteWithFooter(
            context.outNotePartial.rho,
            context.outNotePartial.asset,
            BigInt(outAmount),
            context.signature,
        )
        return [outNote];
    }

    public getRelayerContractCallParameters(context: RedeemContext) {
        if (!context
            || !context.inNote
            || !context.outNotePartial
            || !context.signature
            || !context.merkleRoot
            || !context.proof) {
            throw new DarkpoolError("Invalid context");
        }

        return {
            args: {
                relayer: context.relayer.relayerAddress,
                merkleRoot: context.merkleRoot,
                zkNoteNullifier: context.proof.inNullifier,
                zkNoteAsset: context.inNote.asset,
                zkNoteAmount: hexlify32(context.inNote.amount),
                outNoteFooter: hexlify32(context.outNotePartial.footer),
            },
            proof: context.proof.proof.proof,
        }
    }
}