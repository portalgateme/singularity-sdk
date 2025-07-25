import {
    createPartialNote,
    generateTheDeepDepositProof,
    PartialNote,
    recoverNoteWithFooter,
    TheDeepDepositProofResult
} from '@thesingularitynetwork/darkpool-v1-proof';
import { ethers } from 'ethers';
import TheDeepVaultAssetManagerAbi from '../../abis/TheDeepVaultAssetManager.json';
import { DarkPool } from '../../darkpool';
import { DarkpoolError, Token } from '../../entities';
import { hexlify32, isNativeAsset } from '../../utils/util';
import { allowance } from '../base/allowanceUtil';
import { BaseContext, SingleNoteResult } from '../BaseService';
import { getOutEvent } from '../EventService';

class TheDeepDepositContext extends BaseContext {
    private _address?: string;
    private _inAsset1?: Token;
    private _inAmount1?: bigint;
    private _inAsset2?: Token;
    private _inAmount2?: bigint;
    private _vault?: string;
    private _volatility?: bigint;
    private _outNotePartial?: PartialNote;
    private _proof?: TheDeepDepositProofResult;

    constructor(signature: string) {
        super(signature);
    }

    set address(address: string | undefined) {
        this._address = address;
    }

    get address(): string | undefined {
        return this._address;
    }

    set inAsset1(inAsset1: Token | undefined) {
        this._inAsset1 = inAsset1;
    }

    set inAsset2(inAsset2: Token | undefined) {
        this._inAsset2 = inAsset2;
    }

    get inAsset1(): Token | undefined {
        return this._inAsset1;
    }

    get inAsset2(): Token | undefined {
        return this._inAsset2;
    }

    set inAmount1(inAmount1: bigint | undefined) {
        this._inAmount1 = inAmount1;
    }

    get inAmount1(): bigint | undefined {
        return this._inAmount1;
    }

    set inAmount2(inAmount2: bigint | undefined) {
        this._inAmount2 = inAmount2;
    }

    get inAmount2(): bigint | undefined {
        return this._inAmount2;
    }

    set vault(vault: string | undefined) {
        this._vault = vault;
    }

    get vault(): string | undefined {
        return this._vault;
    }

    set volatility(volatility: bigint | undefined) {
        this._volatility = volatility;
    }

    get volatility(): bigint | undefined {
        return this._volatility;
    }

    set outNotePartial(note: PartialNote | undefined) {
        this._outNotePartial = note;
    }

    get outNotePartial(): PartialNote | undefined {
        return this._outNotePartial;
    }

    set proof(proof: TheDeepDepositProofResult | undefined) {
        this._proof = proof;
    }

    get proof(): TheDeepDepositProofResult | undefined {
        return this._proof;
    }
}

export class TheDeepDepositService {
    private _darkPool: DarkPool;
    constructor(_darkPool: DarkPool) {
        this._darkPool = _darkPool;
    }

    public async prepare(
        address: string,
        inAmount1: bigint,
        inAsset1: Token,
        inAmount2: bigint,
        inAsset2: Token,
        vault: string,
        volatility: bigint,
        signature: string
    ): Promise<{ context: TheDeepDepositContext; outPartialNote: PartialNote }> {
        const outNotePartial = await createPartialNote(vault, signature);

        const context = new TheDeepDepositContext(signature);
        context.address = address;
        context.inAsset1 = inAsset1;
        context.inAmount1 = inAmount1;
        context.inAsset2 = inAsset2;
        context.inAmount2 = inAmount2;
        context.vault = vault;
        context.volatility = volatility;
        context.outNotePartial = outNotePartial;
        return { context, outPartialNote: outNotePartial };
    }

    public async generateProof(context: TheDeepDepositContext): Promise<void> {
        if (!context
            || !context.address
            || !context.inAsset1
            || context.inAmount1 === undefined
            || !context.inAsset2
            || context.inAmount2 === undefined
            || !context.vault
            || !context.outNotePartial
            || context.volatility === undefined
            || !context.signature) {
            throw new DarkpoolError('Invalid context');
        }

        const proof = await generateTheDeepDepositProof({
            address: context.address,
            asset1: context.inAsset1.address,
            amount1: context.inAmount1,
            asset2: context.inAsset2.address,
            amount2: context.inAmount2,
            outNotePartial: context.outNotePartial,
            volatility: context.volatility,
            signedMessage: context.signature,
            options: this._darkPool.proofOptions
        });
        context.proof = proof;
    }

    public async execute(context: TheDeepDepositContext): Promise<SingleNoteResult> {
        if (!this._darkPool.contracts.theDeepAssetManager) {
            throw new DarkpoolError('TheDeepAssetManager not found in contract config');
        }

        if (!context
            || !context.address
            || !context.signature
            || !context.proof
            || !context.inAsset1
            || !context.inAsset2
            || context.inAmount1 === undefined
            || context.inAmount2 === undefined
            || context.volatility === undefined
            || !context.outNotePartial
        ) {
            throw new DarkpoolError('Invalid context');
        }
        const signer = this._darkPool.signer;
        const contract = new ethers.Contract(
            this._darkPool.contracts.theDeepAssetManager,
            TheDeepVaultAssetManagerAbi.abi,
            signer
        );

        if (context.inAmount1 > 0n) {
            if (!isNativeAsset(context.inAsset1.address)) {
                await allowance(this._darkPool, context.inAsset1.address, this._darkPool.contracts.theDeepAssetManager, context.inAmount1);
            }
        }

        if (context.inAmount2 > 0n) {
            if (!isNativeAsset(context.inAsset2.address)) {
                await allowance(this._darkPool, context.inAsset2.address, this._darkPool.contracts.theDeepAssetManager, context.inAmount2);
            }
        }

        const tx = await contract.theDeepDeposit(
            [
                context.inAsset1.address,
                hexlify32(context.inAmount1),
                context.inAsset2.address,
                hexlify32(context.inAmount2),
                context.proof.outNoteFooter,
                context.proof.outNullifier,
                context.vault,
                hexlify32(context.volatility)
            ],
            context.proof.proof.proof
        );

        context.tx = tx.hash;

        const receipt = await tx.wait();
        if(receipt.status === 0) {
            throw new DarkpoolError('TheDeepDeposit failed');
        }

        return await this.postExecute(context);
    }

    private async postExecute(context: TheDeepDepositContext): Promise<SingleNoteResult> {
        if (!context || !context.outNotePartial || !context.signature) {
            throw new DarkpoolError('Invalid context');
        }

        if (!context.tx) {
            throw new DarkpoolError('No transaction hash');
        }

        const event = await getOutEvent(context.tx, TheDeepVaultAssetManagerAbi.abi, 'TheDeepDeposit', this._darkPool);

        if (!event || !event.args || !event.args[3]) {
            throw new DarkpoolError('Can not find Locked Event from transaction: ' + context.tx);
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
