import { Note, PartialNote, UniswapSingleSwapProofResult, createPartialNote, generateUniswapSwapProof, recoverNoteWithFooter } from "@thesingularitynetwork/darkpool-v1-proof";
import { ethers } from "ethers";
import UniswapSwapAssetManagerAbi from '../../abis/UniswapSwapAssetManager.json';
import { Action, relayerPathConfig } from "../../config/config";
import { UniswapSwapRelayerRequest } from "../../entities/relayerRequestTypes";
import { Token } from "../../entities/token";
import { hexlify32, isAddressEquals } from "../../utils/util";
import { BaseRelayerContext, BaseRelayerService, SingleNoteResult } from "../BaseService";
import { getMerklePathAndRoot } from "../merkletree";
import { Relayer } from "../../entities/relayer";
import { DarkpoolError } from "../../entities";
import { DarkPool } from "../../darkpool";

export interface UniswapSingleSwapRequest {
    inNote: Note;
    outAsset: Token;
    minExpectedOutAmount: bigint;
    feeTier: number;
}

class UniswapSingleSwapContext extends BaseRelayerContext {
    private _request?: UniswapSingleSwapRequest;
    private _proof?: UniswapSingleSwapProofResult;
    private _outPartialNote?: PartialNote;

    constructor(relayer: Relayer, signature: string) {
        super(relayer, signature);
    }

    set request(request: UniswapSingleSwapRequest | undefined) {
        this._request = request;
    }

    get request(): UniswapSingleSwapRequest | undefined {
        return this._request;
    }

    set proof(proof: UniswapSingleSwapProofResult | undefined) {
        this._proof = proof;
    }

    get proof(): UniswapSingleSwapProofResult | undefined {
        return this._proof;
    }

    set outPartialNote(outPartialNote: PartialNote | undefined) {
        this._outPartialNote = outPartialNote;
    }

    get outPartialNote(): PartialNote | undefined {
        return this._outPartialNote;
    }
}

export class UniswapSingleSwapService extends BaseRelayerService<UniswapSingleSwapContext, UniswapSwapRelayerRequest, SingleNoteResult> {
    constructor(_darkPool: DarkPool) {
        super(_darkPool);
    }

    public async prepare(request: UniswapSingleSwapRequest, signature: string): Promise<{ context: UniswapSingleSwapContext, outPartialNotes: PartialNote[] }> {
        const outPartialNote = await createPartialNote(request.outAsset.address, signature);
        const context = new UniswapSingleSwapContext(this._darkPool.getRelayer(), signature);
        context.request = request;
        context.outPartialNote = outPartialNote;
        return { context, outPartialNotes: [outPartialNote] };
    }

    public async generateProof(context: UniswapSingleSwapContext): Promise<void> {
        if (!context || !context.request || !context.outPartialNote || !context.signature) {
            throw new DarkpoolError("Invalid context");
        }

        const path = await getMerklePathAndRoot(context.request.inNote.note, this._darkPool);

        const proof = await generateUniswapSwapProof({
            note: context.request.inNote,
            merkleRoot: path.root,
            merklePath: path.path,
            merkleIndex: path.index,
            outNotePartial: context.outPartialNote,
            feeTier: context.request.feeTier,
            amountOutMin: context.request.minExpectedOutAmount,
            relayer: context.relayer.relayerAddress,
            signedMessage: context.signature,
            options: this._darkPool.proofOptions
        });
        context.proof = proof;
    }


    protected async getRelayerRequest(context: UniswapSingleSwapContext): Promise<UniswapSwapRelayerRequest> {
        if (!context || !context.request || !context.outPartialNote || !context.signature || !context.merkleRoot || !context.proof) {
            throw new DarkpoolError("Invalid context");
        }

        const swapRelayerRequest: UniswapSwapRelayerRequest = {
            proof: context.proof.proof.proof,
            merkleRoot: context.merkleRoot,
            asset: context.request.inNote.asset,
            amount: hexlify32(context.request.inNote.amount),
            nullifier: context.proof.inNullifier,
            assetOut: context.request.outAsset.address,
            amountOutMin: hexlify32(context.request.minExpectedOutAmount),
            noteFooterOut: hexlify32(context.outPartialNote.footer),
            relayer: context.relayer.relayerAddress,
            refund: hexlify32(0n),
            poolFee: hexlify32(context.request.feeTier),
            verifierArgs: context.proof.proof.verifyInputs,
        };

        return swapRelayerRequest;
    }

    protected getRelayerPath(): string {
        return relayerPathConfig[Action.UNISWAP_SINGLE_SWAP];
    }

    protected async postExecute(context: UniswapSingleSwapContext): Promise<SingleNoteResult> {
        if (!context || !context.request || !context.tx || !context.outPartialNote || !context.signature || !context.merkleRoot || !context.proof) {
            throw new DarkpoolError("Invalid context");
        }

        const [amountOut, noteCommitmentOut] = await this.getOutAmount(context.tx);
        if (!amountOut || !noteCommitmentOut) {
            throw new DarkpoolError("Failed to find the UniswapSwap event in the transaction receipt.");
        } else {
            let processedOutAsset = context.request.outAsset.address;
            if (isAddressEquals(context.request.outAsset.address, this._darkPool.contracts.nativeWrapper)) {
                processedOutAsset = this._darkPool.contracts.ethAddress;
            }

            const outNote = await recoverNoteWithFooter(
                context.outPartialNote.rho,
                processedOutAsset,
                BigInt(amountOut),
                context.signature,
            )

            return { note: outNote, txHash: context.tx };
        }
    }

    private async getOutAmount(tx: string) {
        const iface = new ethers.Interface(UniswapSwapAssetManagerAbi.abi)
        const receipt = await this._darkPool.provider.getTransactionReceipt(tx)
        if (receipt && receipt.logs.length > 0) {
            const log = receipt.logs.find(
                (log) => log.topics[0] === 'UniswapSwap',
            )
            if (log) {
                const event = iface.parseLog(log)
                if (event) {
                    return [event.args[1], event.args[4]]
                }
            }
        }

        return [null, null]
    }
}