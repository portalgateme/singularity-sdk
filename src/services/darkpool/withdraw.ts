import { Note, PartialNote, WithdrawProofResult, generateWithdrawProof } from "@thesingularitynetwork/darkpool-v1-proof";
import { Action, relayerPathConfig } from "../../config/config";
import { darkPool } from "../../darkpool";
import { WithdrawRelayerRequest } from "../../entities/relayerRequestTypes";
import { hexlify32 } from "../../utils/util";
import { BaseRelayerContext, BaseRelayerService } from "../BaseService";
import { getMerklePathAndRoot } from "../merkletree";
import { Relayer } from "../../entities/relayer";


class WithdrawContext extends BaseRelayerContext {
    private _note?: Note;
    private _recipient?: string;
    private _proof?: WithdrawProofResult;

    constructor(relayer: Relayer, signature: string) {
        super(relayer, signature);
    }

    set note(note: Note) {
        this._note = note;
    }

    get note(): Note | undefined {
        return this._note;
    }

    set recipient(recipient: string) {
        this._recipient = recipient;
    }

    get recipient(): string | undefined {
        return this._recipient;
    }

    set proof(proof: WithdrawProofResult) {
        this._proof = proof;
    }

    get proof(): WithdrawProofResult | undefined {
        return this._proof;
    }
}

export class WithdrawService extends BaseRelayerService<WithdrawContext, WithdrawRelayerRequest> {
    constructor() {
        super();
    }

    public async prepare(note: Note, recipient: string, signature: string): Promise<{ context: WithdrawContext, outPartialNotes: PartialNote[] }> {

        const context = new WithdrawContext(darkPool.getRelayer(), signature);
        context.note = note;
        context.recipient = recipient;
        return { context, outPartialNotes: [] };
    }

    public async generateProof(context: WithdrawContext): Promise<void> {
        if (!context || !context.note || !context.recipient || !context.signature) {
            throw new DarkpoolError("Invalid context");
        }

        const path = await getMerklePathAndRoot(context.note.note);

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
            amount: context.note.amount.toString(),
            refund: hexlify32(0n),
            verifierArgs: context.proof.proof.verifyInputs,
        };

        return withdrawRelayerRequest;
    }

    public getRelayerPath(): string {
        return relayerPathConfig[Action.WITHDRAW];
    }

    public async postExecute(context: WithdrawContext): Promise<Note[]> {
        return [];
    }
}