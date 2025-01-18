import { NftNote, PartialNote, UniswapCollectFeesProofResult, createPartialNote, generateUniswapCollectFeeProof, recoverNoteWithFooter } from "@thesingularitynetwork/darkpool-v1-proof";
import { ethers } from "ethers";
import UniswapLiquidityAssetManagerAbi from '../../abis/UniswapLiquidityAssetManager.json';
import { Action, relayerPathConfig } from "../../config/config";
import { DarkPool } from "../../darkpool";
import { DarkpoolError } from "../../entities";
import { Relayer } from "../../entities/relayer";
import { UniswapCollectFeesRelayerRequest } from "../../entities/relayerRequestTypes";
import { Token } from "../../entities/token";
import { hexlify32 } from "../../utils/util";
import { BaseRelayerContext, BaseRelayerService, MultiNotesResult } from "../BaseService";
import { getMerklePathAndRoot } from "../merkletree";

export interface UniswapCollectFeesRequest {
    inNote: NftNote;
    outAsset1: Token,
    outAsset2: Token,
    deadline: number;
}

class UniswapCollectFeesContext extends BaseRelayerContext {
    private _request?: UniswapCollectFeesRequest;
    private _proof?: UniswapCollectFeesProofResult;
    private _outPartialNote1?: PartialNote;
    private _outPartialNote2?: PartialNote;

    constructor(relayer: Relayer, signature: string) {
        super(relayer, signature);
    }

    public get request(): UniswapCollectFeesRequest | undefined {
        return this._request;
    }

    public set request(value: UniswapCollectFeesRequest | undefined) {
        this._request = value;
    }

    public get proof(): UniswapCollectFeesProofResult | undefined {
        return this._proof;
    }

    public set proof(value: UniswapCollectFeesProofResult | undefined) {
        this._proof = value;
    }

    public get outPartialNote1(): PartialNote | undefined {
        return this._outPartialNote1;
    }

    public set outPartialNote1(value: PartialNote | undefined) {
        this._outPartialNote1 = value;
    }

    public get outPartialNote2(): PartialNote | undefined {
        return this._outPartialNote2;
    }

    public set outPartialNote2(value: PartialNote | undefined) {
        this._outPartialNote2 = value;
    }
}

export class UniswapCollectFeeService extends BaseRelayerService<UniswapCollectFeesContext, UniswapCollectFeesRelayerRequest, MultiNotesResult> {
    constructor(_darkPool: DarkPool) {
        super(_darkPool);
    }

    public async prepare(request: UniswapCollectFeesRequest, signature: string): Promise<{ context: UniswapCollectFeesContext, outPartialNotes: PartialNote[] }> {
        const outPartialNote1 = await createPartialNote(request.outAsset1.address, signature);
        const outPartialNote2 = await createPartialNote(request.outAsset2.address, signature);

        const context = new UniswapCollectFeesContext(this._darkPool.getRelayer(), signature);
        context.request = request;
        context.outPartialNote1 = outPartialNote1;
        context.outPartialNote2 = outPartialNote2;

        return { context, outPartialNotes: [outPartialNote1, outPartialNote2] };
    }

    public async generateProof(context: UniswapCollectFeesContext): Promise<void> {
        if (!context
            || !context.request
            || !context.outPartialNote1
            || !context.outPartialNote2
            || !context.signature) {
            throw new DarkpoolError("Invalid context");
        }

        const path = await getMerklePathAndRoot(context.request.inNote.note, this._darkPool);

        const proof = await generateUniswapCollectFeeProof({
            inNote: context.request.inNote,
            merkleRoot: path.root,
            merklePath: path.path,
            merkleIndex: path.index,
            outNoteFooter1: context.outPartialNote1,
            outNoteFooter2: context.outPartialNote2,
            relayer: context.relayer.relayerAddress,
            signedMessage: context.signature,
        });
        context.proof = proof;
    }


    protected async getRelayerRequest(context: UniswapCollectFeesContext): Promise<UniswapCollectFeesRelayerRequest> {
        if (!context
            || !context.request
            || !context.outPartialNote1
            || !context.outPartialNote2
            || !context.merkleRoot
            || !context.proof) {
            throw new DarkpoolError("Invalid context");
        }

        const relayerRequest: UniswapCollectFeesRelayerRequest = {
            proof: context.proof.proof.proof,
            merkleRoot: context.merkleRoot,
            tokenId: hexlify32(context.request.inNote.tokenId),
            feeNoteFooter1: hexlify32(context.outPartialNote1.footer),
            feeNoteFooter2: hexlify32(context.outPartialNote2.footer),
            relayer: context.relayer.relayerAddress,
            relayerGasFeeFromToken1: hexlify32(0n),
            relayerGasFeeFromToken2: hexlify32(0n),
            verifierArgs: context.proof.proof.verifyInputs,
        };

        return relayerRequest;
    }

    protected getRelayerPath(): string {
        return relayerPathConfig[Action.UNISWAP_LP_COLLECT_FEE];
    }

    protected async postExecute(context: UniswapCollectFeesContext): Promise<MultiNotesResult> {
        if (!context
            || !context.request
            || !context.tx
            || !context.outPartialNote1
            || !context.outPartialNote2
            || !context.signature) {
            throw new DarkpoolError("Invalid context");
        }

        const [outAmount1, outAmount2] = await this.getOutAmounts(context.tx)
        if (!outAmount1 || !outAmount2) {
            throw new DarkpoolError("Failed to find the UniswapCollectFees event in the transaction receipt.");
        } else {
            const outNote1 = await recoverNoteWithFooter(
                context.outPartialNote1.rho,
                context.outPartialNote1.asset,
                BigInt(outAmount1),
                context.signature,
            )
            const outNote2 = await recoverNoteWithFooter(
                context.outPartialNote2.rho,
                context.outPartialNote2.asset,
                BigInt(outAmount2),
                context.signature,
            )

            return { notes: [outNote1, outNote2], txHash: context.tx };
        }
    }

    private async getOutAmounts(tx: string) {
        const iface = new ethers.Interface(UniswapLiquidityAssetManagerAbi.abi)
        const receipt = await this._darkPool.provider.getTransactionReceipt(tx)
        if (receipt && receipt.logs.length > 0) {
            const log = receipt.logs.find(
                (log) => log.topics[0] === 'UniswapCollectFees',
            )
            if (log) {
                const event = iface.parseLog(log)
                if (event) {
                    return event.args[2]
                }
            }
        }

        return [null, null]
    }
}