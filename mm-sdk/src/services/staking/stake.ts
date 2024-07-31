import { zkDepositProofResult, Note, createNote, generateZkDepositProof } from "@thesingularitynetwork/darkpool-v1-proof";
import { Token } from "../../entities/token";
import { hexlify32, isNativeAsset } from "../../utils/util";
import { BaseContext, BaseContractService } from "../BaseService";
import { darkPool } from "../../darkpool";
import { ethers } from "ethers";
import StakingAssetManagerAbi from '../../abis/StakingAssetManager.json'
import { DarkpoolError } from "../../entities";
import { getZkTokenFromOriginalToken } from "./stakingUtils";


class StakeContext extends BaseContext {
    private _inAsset?: Token;
    private _outNote?: Note;
    private _address?: string;
    private _proof?: zkDepositProofResult;

    constructor(signature: string) {
        super(signature);
    }

    set inAsset(inAsset: Token | undefined) {
        this._inAsset = inAsset;
    }

    get inAsset(): Token | undefined {
        return this._inAsset;
    }

    set outNote(note: Note | undefined) {
        this._outNote = note;
    }

    get outNote(): Note | undefined {
        return this._outNote;
    }

    set address(address: string | undefined) {
        this._address = address;
    }

    get address(): string | undefined {
        return this._address;
    }

    set proof(proof: zkDepositProofResult | undefined) {
        this._proof = proof;
    }

    get proof(): zkDepositProofResult | undefined {
        return this._proof;
    }
}

export class StakeService extends BaseContractService<StakeContext> {
    constructor() {
        super();
    }

    public async prepare(inAsset: Token, inAmount: bigint, walletAddress: string, signature: string): Promise<{ context: StakeContext, outNotes: Note[] }> {
        const zkToken = await getZkTokenFromOriginalToken(inAsset.address);
        if (!zkToken) {
            throw new DarkpoolError("The token is not supported in compliant staking: " + inAsset.address);
        }

        const outNote = await createNote(zkToken.address, inAmount, signature);
        const context = new StakeContext(signature);
        context.inAsset = inAsset;
        context.outNote = outNote;
        context.address = walletAddress;
        return { context, outNotes: [outNote] };
    }

    public async generateProof(context: StakeContext): Promise<void> {
        if (
            !context
            || !context.inAsset
            || !context.outNote
            || !context.address
            || !context.signature) {
            throw new DarkpoolError("Invalid context");
        }
        const proof = await generateZkDepositProof({
            address: context.address,
            inAsset: context.inAsset.address,
            outNote: context.outNote,
            signedMessage: context.signature,
        });
        context.proof = proof;
    }

    public async execute(context: StakeContext): Promise<string> {
        if (!context
            || !context.inAsset
            || !context.outNote
            || !context.address
            || !context.signature
            || !context.proof) {
            throw new DarkpoolError("Invalid context");
        }
        const signer = darkPool.signer;
        const contract = new ethers.Contract(darkPool.contracts.stakingAssetManager, StakingAssetManagerAbi.abi, signer);

        if (!isNativeAsset(context.inAsset.address)) {
            await this.allowance();
            const tx = await contract.lockERC20(
                [
                    context.inAsset.address,
                    hexlify32(context.outNote.amount),
                    hexlify32(context.outNote.note),
                    context.proof.outNoteFooter,
                ],
                context.proof.proof.proof
            );
            return tx.hash;

        } else {
            const tx = await contract.lockETH(
                [
                    hexlify32(context.outNote.note),
                    context.proof.outNoteFooter
                ],
                context.proof.proof.proof,
                { value: context.outNote.amount }
            );
            return tx.hash;
        }
    }

    protected async allowance() {
    }
}