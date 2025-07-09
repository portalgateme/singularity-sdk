import {
    Note,
    PartialNote,
    TheDeepWithdrawProofResult,
    createPartialNote,
    generateTheDeepWithdrawProof,
    recoverNoteWithFooter
} from '@thesingularitynetwork/darkpool-v1-proof';
import { Action, relayerPathConfig } from '../../config/config';
import { DarkPool } from '../../darkpool';
import { DarkpoolError, Relayer, TheDeepWithdrawRelayerRequest } from '../../entities';
import { hexlify32 } from '../../utils/util';
import { BaseRelayerContext, BaseRelayerService, MultiNotesResult } from '../BaseService';
import { getOutEvent } from '../EventService';
import { getMerklePathAndRoot } from '../merkletree';
import TheDeepVaultAssetManagerAbi from '../../abis/TheDeepVaultAssetManager.json';

class TheDeepWithdrawContext extends BaseRelayerContext {
    private _inNote?: Note;
    private _outNotePartial1?: PartialNote;
    private _outNotePartial2?: PartialNote;
    private _proof?: TheDeepWithdrawProofResult;

    constructor(relayer: Relayer, signature: string) {
        super(relayer, signature);
    }

    set inNote(inAsset: Note | undefined) {
        this._inNote = inAsset;
    }

    get inNote(): Note | undefined {
        return this._inNote;
    }

    set outNotePartial1(note: PartialNote | undefined) {
        this._outNotePartial1 = note;
    }

    get outNotePartial1(): PartialNote | undefined {
        return this._outNotePartial1;
    }

    set outNotePartial2(note: PartialNote | undefined) {
        this._outNotePartial2 = note;
    }

    get outNotePartial2(): PartialNote | undefined {
        return this._outNotePartial2;
    }

    set proof(proof: TheDeepWithdrawProofResult | undefined) {
        this._proof = proof;
    }

    get proof(): TheDeepWithdrawProofResult | undefined {
        return this._proof;
    }
}

export class TheDeepWithdrawService extends BaseRelayerService<TheDeepWithdrawContext, TheDeepWithdrawRelayerRequest, MultiNotesResult> {
    constructor(_darkPool: DarkPool) {
        super(_darkPool);
    }

    public async prepare(
        inNote: Note,
        outAsset1: string,
        outAsset2: string,
        signature: string
    ): Promise<{ context: TheDeepWithdrawContext; outPartialNotes: PartialNote[] }> {
        const outNotePartial1 = await createPartialNote(outAsset1, signature);
        const outNotePartial2 = await createPartialNote(outAsset2, signature);

        const context = new TheDeepWithdrawContext(this._darkPool.getRelayer(), signature);
        context.inNote = inNote;
        context.outNotePartial1 = outNotePartial1;
        context.outNotePartial2 = outNotePartial2;
        return { context, outPartialNotes: [outNotePartial1, outNotePartial2] };
    }

    public async generateProof(context: TheDeepWithdrawContext): Promise<void> {
        if (!context || !context.inNote || !context.outNotePartial1 || !context.outNotePartial2 || !context.signature) {
            throw new DarkpoolError('Invalid context');
        }

        const path = await getMerklePathAndRoot(context.inNote.note, this._darkPool);
        context.merkleRoot = path.root;

        const proof = await generateTheDeepWithdrawProof({
            merkleRoot: path.root,
            merklePath: path.path,
            merkleIndex: path.index,
            inNote: context.inNote,
            outNotePartial1: context.outNotePartial1,
            outNotePartial2: context.outNotePartial2,
            relayer: context.relayer.relayerAddress,
            signedMessage: context.signature,
            options: this._darkPool.proofOptions
        });
        context.proof = proof;
    }

    public async getRelayerRequest(context: TheDeepWithdrawContext): Promise<TheDeepWithdrawRelayerRequest> {
        if (
            !context ||
            !context.inNote ||
            !context.outNotePartial1 ||
            !context.outNotePartial2 ||
            !context.signature ||
            !context.merkleRoot ||
            !context.proof
        ) {
            throw new DarkpoolError('Invalid context');
        }

        const relayerRequest: TheDeepWithdrawRelayerRequest = {
            amount: hexlify32(context.inNote.amount),
            vaultAddress: context.inNote.asset,
            nullifier: context.proof.inNullifier,
            outAsset1: context.outNotePartial1.asset,
            outAsset2: context.outNotePartial2.asset,
            outNoteFooter1: hexlify32(context.outNotePartial1.footer),
            outNoteFooter2: hexlify32(context.outNotePartial2.footer),
            refund1: hexlify32(0n),
            refund2: hexlify32(0n),
            proof: context.proof.proof.proof,
            merkleRoot: context.merkleRoot,
            relayer: context.relayer.relayerAddress,
            verifierArgs: context.proof.proof.verifyInputs
        };

        return relayerRequest;
    }

    public getRelayerPath(): string {
        return relayerPathConfig[Action.THE_DEEP_WITHDRAW];
    }

    public async postExecute(context: TheDeepWithdrawContext): Promise<MultiNotesResult> {
        if (!context || !context.outNotePartial1 || !context.outNotePartial2 || !context.signature) {
            throw new DarkpoolError('Invalid context');
        }

        if (!context.tx) {
            throw new DarkpoolError('No transaction hash');
        }
        const event = await getOutEvent(context.tx, TheDeepVaultAssetManagerAbi.abi, 'TheDeepWithdrawal', this._darkPool);

        if (!event || !event.args || !event.args[2] ) {
            throw new DarkpoolError('Can not find TheDeepWithdrawal Event from transaction: ' + context.tx);
        }

        const outAmount1 = event.args[2][0];
        const outAmount2 = event.args[2][1];
        const outNote1 = await recoverNoteWithFooter(
            context.outNotePartial1.rho,
            context.outNotePartial1.asset,
            BigInt(outAmount1),
            context.signature
        );
        const outNote2 = await recoverNoteWithFooter(
            context.outNotePartial2.rho,
            context.outNotePartial2.asset,
            BigInt(outAmount2),
            context.signature
        );
        return { notes: [outNote1, outNote2], txHash: context.tx };
    }
}
