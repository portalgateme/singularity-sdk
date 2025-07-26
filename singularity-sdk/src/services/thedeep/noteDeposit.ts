import {
    createPartialNote,
    generateTheDeepNoteDepositProof,
    Note,
    PartialNote,
    recoverNoteWithFooter,
    TheDeepNoteDepositProofResult
} from '@thesingularitynetwork/darkpool-v1-proof';
import TheDeepVaultAssetManagerAbi from '../../abis/TheDeepVaultAssetManager.json';
import { DarkPool } from '../../darkpool';
import { DarkpoolError, Relayer, TheDeepNoteDepositRelayerRequest } from '../../entities';
import { hexlify32 } from '../../utils/util';
import { BaseRelayerContext, BaseRelayerService, SingleNoteResult } from '../BaseService';
import { getOutEvent } from '../EventService';
import { getMerklePathAndRoot } from '../merkletree';
import { Action, relayerPathConfig } from '../../config/config';

class TheDeepNoteDepositContext extends BaseRelayerContext {
    private _inNote1?: Note;
    private _inNote2?: Note;
    private _outNotePartial?: PartialNote;
    private _volatility?: bigint;
    private _proof?: TheDeepNoteDepositProofResult;

    constructor(relayer: Relayer, signature: string) {
        super(relayer, signature);
    }

    set inNote1(inNote1: Note | undefined) {
        this._inNote1 = inNote1;
    }

    get inNote1(): Note | undefined {
        return this._inNote1;
    }

    set inNote2(inNote2: Note | undefined) {
        this._inNote2 = inNote2;
    }

    get inNote2(): Note | undefined {
        return this._inNote2;
    }

    set outNotePartial(outNotePartial: PartialNote | undefined) {
        this._outNotePartial = outNotePartial;
    }

    get outNotePartial(): PartialNote | undefined {
        return this._outNotePartial;
    }

    set volatility(volatility: bigint | undefined) {
        this._volatility = volatility;
    }

    get volatility(): bigint | undefined {
        return this._volatility;
    }

    set proof(proof: TheDeepNoteDepositProofResult | undefined) {
        this._proof = proof;
    }

    get proof(): TheDeepNoteDepositProofResult | undefined {
        return this._proof;
    }
}

export class TheDeepNoteDepositService extends BaseRelayerService<TheDeepNoteDepositContext, TheDeepNoteDepositRelayerRequest, SingleNoteResult> {

    constructor(_darkPool: DarkPool) {
        super(_darkPool);
    }

    public async prepare(
        inNote1: Note,
        inNote2: Note,
        vault: string,
        volatility: bigint,
        signature: string
    ): Promise<{ context: TheDeepNoteDepositContext; outPartialNotes: PartialNote[] }> {
        const outNotePartial = await createPartialNote(vault, signature);

        const context = new TheDeepNoteDepositContext(this._darkPool.getRelayer(), signature);
        context.inNote1 = inNote1;
        context.inNote2 = inNote2;
        context.outNotePartial = outNotePartial;
        context.volatility = volatility;
        return { context, outPartialNotes: [outNotePartial] };
    }

    public async generateProof(context: TheDeepNoteDepositContext): Promise<void> {
        if (!context
            || !context.inNote1
            || !context.inNote2
            || !context.outNotePartial
            || context.volatility === undefined
            || !context.signature) {
            throw new DarkpoolError('Invalid context');
        }

        let merkleRoot;
        let merkleIndex1 = Array(32).fill(0);
        let merklePath1 = Array(32).fill(hexlify32(0n));
        let merkleIndex2 = Array(32).fill(0);
        let merklePath2 = Array(32).fill(hexlify32(0n));

        if (context.inNote1.amount > 0n) {
            const path = await getMerklePathAndRoot(context.inNote1.note, this._darkPool);
            merkleRoot = path.root;
            merkleIndex1 = path.index;
            merklePath1 = path.path;
        }

        if (context.inNote2.amount > 0n) {
            const path = await getMerklePathAndRoot(context.inNote2.note, this._darkPool);
            merkleRoot = path.root;
            merkleIndex2 = path.index;
            merklePath2 = path.path;
        }

        context.merkleRoot = merkleRoot;

        const proof = await generateTheDeepNoteDepositProof({
            merkleRoot,
            merkleIndex1,
            merklePath1,
            merkleIndex2,
            merklePath2,
            inNote1: context.inNote1,
            inNote2: context.inNote2,
            outNotePartial: context.outNotePartial,
            volatility: context.volatility,
            relayer: context.relayer.relayerAddress,
            signedMessage: context.signature,
            options: this._darkPool.proofOptions
        });
        context.proof = proof;
    }

    public async getRelayerRequest(context: TheDeepNoteDepositContext): Promise<TheDeepNoteDepositRelayerRequest> {
        if (
            !context ||
            !context.inNote1 ||
            !context.inNote2 ||
            !context.outNotePartial ||
            context.volatility === undefined ||
            !context.signature ||
            !context.merkleRoot ||
            !context.proof
        ) {
            throw new DarkpoolError('Invalid context');
        }

        const relayerRequest: TheDeepNoteDepositRelayerRequest = {
            asset1: context.inNote1.asset,
            amount1: hexlify32(context.inNote1.amount),
            asset2: context.inNote2.asset,
            amount2: hexlify32(context.inNote2.amount),
            inNullifier1: context.proof.inNullifier1,
            inNullifier2: context.proof.inNullifier2,
            noteFooter: context.proof.outNoteFooter,
            nullifier: context.proof.outNullifier,
            vaultAddress: context.outNotePartial.asset,
            volatility: hexlify32(context.volatility),
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
        return relayerPathConfig[Action.THE_DEEP_NOTE_DEPOSIT];
    }

    public async postExecute(context: TheDeepNoteDepositContext): Promise<SingleNoteResult> {
        if (!context
            || !context.outNotePartial
            || !context.signature) {
            throw new DarkpoolError('Invalid context');
        }

        if (!context.tx) {
            throw new DarkpoolError('No transaction hash');
        }
        const event = await getOutEvent(context.tx, TheDeepVaultAssetManagerAbi.abi, 'TheDeepDeposit', this._darkPool);

        if (!event || !event.args || !event.args[3]) {
            throw new DarkpoolError('Can not find TheDeepDeposit Event from transaction: ' + context.tx);
        }

        const outAmount = event.args[3];

        const outNote = await recoverNoteWithFooter(
            context.outNotePartial.rho,
            context.outNotePartial.asset,
            BigInt(outAmount),
            context.signature
        );

        return { note: outNote, txHash: context.tx! };
    }
}