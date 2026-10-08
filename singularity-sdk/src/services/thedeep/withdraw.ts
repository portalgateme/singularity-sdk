import {
    Note,
    PartialNote,
    TheDeepWithdrawProofResult,
    generateTheDeepWithdrawProof
} from '@thesingularitynetwork/darkpool-v1-proof';
import { Action, relayerPathConfig } from '../../config/config';
import { DarkPool } from '../../darkpool';
import { DarkpoolError, Relayer, TheDeepWithdrawRelayerRequest } from '../../entities';
import { hexlify32 } from '../../utils/util';
import { BaseRelayerContext, BaseRelayerService, MultiWithdrawResult } from '../BaseService';
import { getOutEvent } from '../EventService';
import { getMerklePathAndRoot } from '../merkletree';
import TheDeepVaultAssetManagerAbi from '../../abis/TheDeepVaultAssetManager.json';

class TheDeepWithdrawContext extends BaseRelayerContext {
    private _inNote?: Note;
    private _proof?: TheDeepWithdrawProofResult;
    private _receipt?: string;

    constructor(relayer: Relayer, signature: string) {
        super(relayer, signature);
    }

    set inNote(inAsset: Note | undefined) {
        this._inNote = inAsset;
    }

    get inNote(): Note | undefined {
        return this._inNote;
    }

    set proof(proof: TheDeepWithdrawProofResult | undefined) {
        this._proof = proof;
    }

    get proof(): TheDeepWithdrawProofResult | undefined {
        return this._proof;
    }

    set receipt(receipt: string | undefined) {
        this._receipt = receipt;
    }

    get receipt(): string | undefined {
        return this._receipt;
    }
}

export class TheDeepWithdrawService extends BaseRelayerService<TheDeepWithdrawContext, TheDeepWithdrawRelayerRequest, MultiWithdrawResult> {
    constructor(_darkPool: DarkPool) {
        super(_darkPool);
    }

    public async prepare(
        inNote: Note,
        receipt: string,
        signature: string
    ): Promise<{ context: TheDeepWithdrawContext; outPartialNotes: PartialNote[] }> {

        const context = new TheDeepWithdrawContext(this._darkPool.getRelayer(), signature);
        context.inNote = inNote;
        context.receipt = receipt;
        return { context, outPartialNotes: [] };
    }

    public async generateProof(context: TheDeepWithdrawContext): Promise<void> {
        if (!context || !context.inNote || !context.receipt || !context.signature) {
            throw new DarkpoolError('Invalid context');
        }

        const path = await getMerklePathAndRoot(context.inNote.note, this._darkPool);
        context.merkleRoot = path.root;

        const proof = await generateTheDeepWithdrawProof({
            merkleRoot: path.root,
            merklePath: path.path,
            merkleIndex: path.index,
            inNote: context.inNote,
            relayer: context.relayer.relayerAddress,
            receipt: context.receipt,
            signedMessage: context.signature,
            options: this._darkPool.proofOptions
        });
        context.proof = proof;
    }

    public async getRelayerRequest(context: TheDeepWithdrawContext): Promise<TheDeepWithdrawRelayerRequest> {
        if (
            !context ||
            !context.inNote ||
            !context.receipt ||
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
            receipt: context.receipt,
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

    public async postExecute(context: TheDeepWithdrawContext): Promise<MultiWithdrawResult> {
        if (!context || !context.receipt || !context.signature) {
            throw new DarkpoolError('Invalid context');
        }

        if (!context.tx) {
            throw new DarkpoolError('No transaction hash');
        }
        const event = await getOutEvent(context.tx, TheDeepVaultAssetManagerAbi.abi, 'TheDeepWithdrawal', this._darkPool);

        if (!event || !event.args || !event.args[3] ) {
            throw new DarkpoolError('Can not find TheDeepWithdrawal Event from transaction: ' + context.tx);
        }

        const outAmount1 = BigInt(event.args[3][0]);
        const outAmount2 = BigInt(event.args[3][1]);
        
        return { txHash: context.tx, outAmounts: [outAmount1, outAmount2] };
    }
}
