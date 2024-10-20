import { DepositProofResult, Note, createNote, generateDepositProof } from "@thesingularitynetwork/darkpool-v1-proof";
import { ethers } from "ethers";
import DarkpoolAssetManagerAbi from '../../abis/DarkpoolAssetManager.json';
import { darkPool } from "../../darkpool";
import { DarkpoolError } from "../../entities";
import { hexlify32, isNativeAsset } from "../../utils/util";
import { BaseContext, BaseContractService } from "../BaseService";


export class DepositContext extends BaseContext {
    private _note?: Note;
    private _address?: string;
    private _proof?: DepositProofResult;

    constructor(signature: string) {
        super(signature);
    }

    set note(note: Note | undefined) {
        this._note = note;
    }

    get note(): Note | undefined {
        return this._note;
    }

    set address(address: string | undefined) {
        this._address = address;
    }

    get address(): string | undefined {
        return this._address;
    }

    set proof(proof: DepositProofResult | undefined) {
        this._proof = proof;
    }

    get proof(): DepositProofResult | undefined {
        return this._proof;
    }
}

export class DepositService extends BaseContractService<DepositContext> {
    constructor() {
        super();
    }

    public async prepare(asset: string, amount: bigint, walletAddress: string, signature: string): Promise<{ context: DepositContext, outNotes: Note[] }> {
        const note = await createNote(asset, amount, signature);
        const context = new DepositContext(signature);
        context.note = note;
        context.address = walletAddress;
        return { context, outNotes: [note] };
    }

    public async generateProof(context: DepositContext): Promise<void> {
        if (!context || !context.note || !context.address || !context.signature) {
            throw new DarkpoolError("Invalid context");
        }
        const proof = await generateDepositProof({
            note: context.note,
            signedMessage: context.signature,
            address: context.address,
        });
        context.proof = proof;
    }

    public async execute(context: DepositContext): Promise<string> {
        if (!context || !context.note || !context.address || !context.signature || !context.proof) {
            throw new DarkpoolError("Invalid context");
        }
        const signer = darkPool.signer;
        const contract = new ethers.Contract(darkPool.contracts.darkpoolAssetManager, DarkpoolAssetManagerAbi.abi, signer);

        if (!isNativeAsset(context.note.asset)) {
            await this.allowance();
            const tx = await contract.depositERC20(
                context.note.asset,
                hexlify32(context.note.amount),
                hexlify32(context.note.note),
                context.proof.noteFooter,
                context.proof.proof.proof
            );
            return tx.hash;

        } else {
            const tx = await contract.depositETH(
                hexlify32(context.note.note),
                context.proof.noteFooter,
                context.proof.proof.proof,
                { value: context.note.amount }
            );
            return tx.hash;
        }
    }

    protected async allowance() {

    }

    public getContractCallParameters(context: DepositContext) {
        if (!context || !context.note || !context.address || !context.signature || !context.proof) {
            throw new DarkpoolError("Invalid context");
        }

        return {
            proof: context.proof.proof.proof,
            asset: context.note.asset,
            amount: hexlify32(context.note.amount),
            note: hexlify32(context.note.note),
            noteFooter: context.proof.noteFooter,
        }
    }
}