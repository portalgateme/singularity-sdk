import { Note, PartialNote, createPartialNote, generateZkStakeProof, recoverNoteWithFooter, zkStakeProofResult } from "@thesingularitynetwork/darkpool-v1-proof";
import StakeAssetManagerAbi from "../../abis/StakingAssetManager.json";
import { Action, relayerPathConfig } from "../../config/config";
import { DarkpoolError, Relayer, StakeNoteRelayerRequest } from "../../entities";
import { hexlify32 } from "../../utils/util";
import { BaseRelayerContext, BaseRelayerService } from "../BaseService";
import { getOutEvent } from "../EventService";
import { getMerklePathAndRoot } from "../merkletree";
import { getZkTokenFromOriginalToken } from "./stakingUtils";
import { DarkPool } from "../../darkpool";


class StakeNoteContext extends BaseRelayerContext {
    private _inNote?: Note;
    private _outNotePartial?: PartialNote;
    private _proof?: zkStakeProofResult;

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

    set proof(proof: zkStakeProofResult | undefined) {
        this._proof = proof;
    }

    get proof(): zkStakeProofResult | undefined {
        return this._proof;
    }
}

export class StakeNoteService extends BaseRelayerService<StakeNoteContext, StakeNoteRelayerRequest> {
    constructor(_darkPool?: DarkPool) {
        super(_darkPool);
    }

    public async prepare(inNote: Note, signature: string): Promise<{ context: StakeNoteContext, outPartialNotes: PartialNote[] }> {
        const zkToken = await getZkTokenFromOriginalToken(inNote.asset);
        if (!zkToken) {
            throw new DarkpoolError("The token is not supported in compliant staking: " + inNote.asset);
        }

        const outNotePartial = await createPartialNote(zkToken.address, signature);

        const context = new StakeNoteContext(this._darkPool.getRelayer(), signature);
        context.inNote = inNote;
        context.outNotePartial = outNotePartial;
        return { context, outPartialNotes: [outNotePartial] };
    }

    public async generateProof(context: StakeNoteContext): Promise<void> {
        if (
            !context
            || !context.inNote
            || !context.outNotePartial
            || !context.signature) {
            throw new DarkpoolError("Invalid context");
        }

        const path = await getMerklePathAndRoot(context.inNote.note, this._darkPool);
        context.merkleRoot = path.root;

        const proof = await generateZkStakeProof({
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

    public async getRelayerRequest(context: StakeNoteContext): Promise<StakeNoteRelayerRequest> {
        if (!context
            || !context.inNote
            || !context.outNotePartial
            || !context.signature
            || !context.merkleRoot
            || !context.proof) {
            throw new DarkpoolError("Invalid context");
        }

        const relayerRequest: StakeNoteRelayerRequest = {
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
        return relayerPathConfig[Action.STAKE];
    }

    public async postExecute(context: StakeNoteContext): Promise<Note[]> {
        if (!context
            || !context.outNotePartial
            || !context.signature
        ) {
            throw new DarkpoolError("Invalid context");
        }

        if (!context.tx) {
            throw new DarkpoolError("No transaction hash");
        }
        const event = await getOutEvent(context.tx, StakeAssetManagerAbi.abi, "Locked", this._darkPool);

        if (!event || !event.args || !event.args[3]) {
            throw new DarkpoolError("Can not find Locked Event from transaction: " + context.tx);
        }

        const outAmount = event.args[3];
        const outNote = await recoverNoteWithFooter(
            context.outNotePartial.rho,
            context.outNotePartial.asset,
            BigInt(outAmount),
            context.signature,
        )
        return [outNote];
    }
}