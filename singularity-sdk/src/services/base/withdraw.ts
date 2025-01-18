import { Note, PartialNote, WithdrawProofResult, generateWithdrawProof } from "@thesingularitynetwork/darkpool-v1-proof";
import { Action, relayerPathConfig } from "../../config/config";
import { WithdrawRelayerRequest } from "../../entities/relayerRequestTypes";
import { hexlify32 } from "../../utils/util";
import { BaseRelayerContext, BaseRelayerResult, BaseRelayerService } from "../BaseService";
import { getMerklePathAndRoot } from "../merkletree";
import { Relayer } from "../../entities/relayer";
import { DarkpoolError } from "../../entities";
import { DarkPool } from "../../darkpool";

class WithdrawContext extends BaseRelayerContext {
    private _note?: Note;
    private _recipient?: string;
    private _proof?: WithdrawProofResult;

    constructor(relayer: Relayer, signature: string) {
        super(relayer, signature);
    }

    set note(note: Note | undefined) {
        this._note = note;
    }

    get note(): Note | undefined {
        return this._note;
    }

    set recipient(recipient: string | undefined) {
        this._recipient = recipient;
    }

    get recipient(): string | undefined {
        return this._recipient;
    }

    set proof(proof: WithdrawProofResult | undefined) {
        this._proof = proof;
    }

    get proof(): WithdrawProofResult | undefined {
        return this._proof;
    }
}



export class WithdrawService extends BaseRelayerService<WithdrawContext, WithdrawRelayerRequest, BaseRelayerResult> {
    constructor(_darkPool: DarkPool) {
        super(_darkPool);
    }

    public async prepare(note: Note, recipient: string, signature: string): Promise<{ context: WithdrawContext, outPartialNotes: PartialNote[] }> {

        const context = new WithdrawContext(this._darkPool.getRelayer(), signature);
        context.note = note;
        context.recipient = recipient;
        return { context, outPartialNotes: [] };
    }

    public async generateProof(context: WithdrawContext): Promise<void> {
        if (!context || !context.note || !context.recipient || !context.signature) {
            throw new DarkpoolError("Invalid context");
        }

        const path = await getMerklePathAndRoot(context.note.note, this._darkPool);
        context.merkleRoot = path.root;

        const proof = await generateWithdrawProof({
            note: context.note,
            address: context.recipient,
            merkleRoot: path.root,
            merklePath: path.path,
            merkleIndex: path.index,
            relayer: context.relayer.relayerAddress,
            signedMessage: context.signature,
        });
        context.proof = proof;
    }

    public async getRelayerRequest(context: WithdrawContext): Promise<WithdrawRelayerRequest> {
        if (!context || !context.note || !context.signature || !context.merkleRoot || !context.recipient || !context.proof) {
            throw new DarkpoolError("Invalid context");
        }

        const withdrawRelayerRequest: WithdrawRelayerRequest = {
            proof: context.proof.proof.proof,
            asset: context.note.asset,
            merkleRoot: context.merkleRoot,
            nullifier: context.proof.nullifier,
            recipient: context.recipient,
            relayer: context.relayer.relayerAddress,
            amount: hexlify32(context.note.amount),
            refund: hexlify32(0n),
            verifierArgs: context.proof.proof.verifyInputs,
        };

        return withdrawRelayerRequest;
    }

    public getRelayerPath(): string {
        return relayerPathConfig[Action.WITHDRAW];
    }

    //eslint-disable-next-line @typescript-eslint/no-unused-vars
    public async postExecute(context: WithdrawContext): Promise<BaseRelayerResult> {
        console.log(context.tx);
        return { txHash: context.tx! };
    }

    public getRelayerContractCallParameters(context: WithdrawContext) {
        if (!context || !context.note || !context.recipient || !context.signature || !context.proof) {
            throw new DarkpoolError("Invalid context");
        }

        return {
            proof: context.proof.proof.proof,
            asset: context.note.asset,
            merkleRoot: context.merkleRoot,
            nullifier: context.proof.nullifier,
            recipient: context.recipient,
            relayer: context.relayer.relayerAddress,
            amount: hexlify32(context.note.amount),
        }
    }
}