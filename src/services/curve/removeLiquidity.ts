import { CurveRemoveLiquidityProofResult, Note, PartialNote, createPartialNote, generateCurveRemoveLiquidityProof, recoverNoteWithFooter } from "@thesingularitynetwork/darkpool-v1-proof";
import { ethers } from "ethers";
import { isEmpty } from 'lodash';
import CurveRemoveLiquidityAssetManagerAbi from '../../abis/CurveRemoveLiquidityAssetManager.json';
import { Action, relayerPathConfig } from "../../config/config";
import { CurvePoolConfig } from "../../config/curveConfig";
import { darkPool } from "../../darkpool";
import { Relayer } from "../../entities/relayer";
import { CurveRemoveLiquidityRelayerRequest } from "../../entities/relayerRequestTypes";
import { hexlify32, isAddressEquals } from "../../utils/util";
import { BaseRelayerContext, BaseRelayerService } from "../BaseService";
import { getMerklePathAndRoot } from "../merkletree";
import { getBooleanFlag, getPoolFlag, getPoolType } from "../defi/curveUtil";

export interface CurveRemoveLiquidityRequest {
    inNote: Note;
    amountBurned: bigint;
    outAssets: string[],
    isWithdrawWrapped: boolean;
    minExpectedOutAmounts: bigint[];
    pool: CurvePoolConfig;
}

class CurveRemoveLiquidityContext extends BaseRelayerContext {
    private _request?: CurveRemoveLiquidityRequest;
    private _proof?: CurveRemoveLiquidityProofResult;
    private _outPartialNotes?: PartialNote[];

    constructor(relayer: Relayer, signature: string) {
        super(relayer, signature);
    }

    set request(request: CurveRemoveLiquidityRequest) {
        this._request = request;
    }

    get request(): CurveRemoveLiquidityRequest | undefined {
        return this._request;
    }

    set proof(proof: CurveRemoveLiquidityProofResult) {
        this._proof = proof;
    }

    get proof(): CurveRemoveLiquidityProofResult | undefined {
        return this._proof;
    }

    set outPartialNotes(outPartialNotes: PartialNote[]) {
        this._outPartialNotes = outPartialNotes;
    }

    get outPartialNotes(): PartialNote[] | undefined {
        return this._outPartialNotes;
    }
}

export class CurveRemoveLiquidityService extends BaseRelayerService<CurveRemoveLiquidityContext, CurveRemoveLiquidityRelayerRequest> {
    constructor() {
        super();
    }

    public async prepare(request: CurveRemoveLiquidityRequest, signature: string): Promise<{ context: CurveRemoveLiquidityContext, outPartialNotes: PartialNote[] }> {
        let outPartialNotes: PartialNote[] = [];
        for (let i = 0; i < 4; i++) {
            if (!isEmpty(request.outAssets[i]) && !isAddressEquals(request.outAssets[i], ethers.ZeroAddress)) {
                const outPartialNote = await createPartialNote(request.outAssets[i], signature);
                outPartialNotes.push(outPartialNote);
            } else {
                outPartialNotes.push({
                    rho: 0n,
                    footer: 0n,
                    asset: ethers.ZeroAddress
                });
            }
            const outPartialNote = await createPartialNote(request.outAssets[i], signature);
            outPartialNotes.push(outPartialNote);
        }

        const outPartialLpChangeNote = await createPartialNote(request.pool.lpToken, signature);
        outPartialNotes.push(outPartialLpChangeNote);

        const context = new CurveRemoveLiquidityContext(darkPool.getRelayer(), signature);
        context.request = request;
        context.outPartialNotes = outPartialNotes;
        return { context, outPartialNotes };
    }

    public async generateProof(context: CurveRemoveLiquidityContext): Promise<void> {
        if (!context
            || !context.request
            || !context.outPartialNotes
            || !context.signature) {
            throw new DarkpoolError("Invalid context");
        }

        const poolFlag = getPoolFlag(context.request.pool, context.request.isWithdrawWrapped);
        const booleanFlag = getBooleanFlag(context.request.pool, context.request.isWithdrawWrapped);

        const path = await getMerklePathAndRoot(context.request.inNote.note);

        const proof = await generateCurveRemoveLiquidityProof({
            merkleRoot: path.root,
            merklePath: path.path,
            merkleIndex: path.index,
            inNote: context.request.inNote,
            amountBurn: context.request.amountBurned,
            pool: context.request.pool.address,
            poolFlag: BigInt(poolFlag),
            booleanFlag,
            outNotePartial1: context.outPartialNotes[0],
            outNotePartial2: context.outPartialNotes[1],
            outNotePartial3: context.outPartialNotes[2],
            outNotePartial4: context.outPartialNotes[3],
            outNotePartialChange: context.outPartialNotes[4],
            minOutAmount1: context.request.minExpectedOutAmounts[0],
            minOutAmount2: context.request.minExpectedOutAmounts[1],
            minOutAmount3: context.request.minExpectedOutAmounts[2],
            minOutAmount4: context.request.minExpectedOutAmounts[3],
            relayer: context.relayer.relayerAddress,
            signedMessage: context.signature,
        });
        context.proof = proof;
    }


    protected async getRelayerRequest(context: CurveRemoveLiquidityContext): Promise<CurveRemoveLiquidityRelayerRequest> {
        if (!context
            || !context.request
            || !context.outPartialNotes
            || !context.signature
            || !context.merkleRoot
            || !context.proof) {
            throw new DarkpoolError("Invalid context");
        }

        const poolFlag = getPoolFlag(context.request.pool, context.request.isWithdrawWrapped);
        const booleanFlag = getBooleanFlag(context.request.pool, context.request.isWithdrawWrapped);

        const relayerRequest: CurveRemoveLiquidityRelayerRequest = {
            proof: context.proof.proof.proof,
            merkleRoot: context.merkleRoot,
            nullifier: context.proof.nullifier,
            asset: context.request.inNote.asset,
            amount: hexlify32(context.request.inNote.amount),
            amountBurn: hexlify32(context.request.amountBurned),
            pool: context.request.pool.address,
            assetsOut: [
                context.outPartialNotes[0].asset,
                context.outPartialNotes[1].asset,
                context.outPartialNotes[2].asset,
                context.outPartialNotes[3].asset],
            minExpectedAmountsOut: context.request.minExpectedOutAmounts.map((amount) => hexlify32(amount)),
            poolType: getPoolType(context.request.pool, context.request.isWithdrawWrapped),
            basePoolType: context.request.pool.basePoolType || 0,
            poolFlag: hexlify32(poolFlag),
            booleanFlag,
            noteFooters: [
                hexlify32(context.outPartialNotes[0].footer),
                hexlify32(context.outPartialNotes[1].footer),
                hexlify32(context.outPartialNotes[2].footer),
                hexlify32(context.outPartialNotes[3].footer),
                hexlify32(context.outPartialNotes[4].footer),
            ],
            relayer: context.relayer.relayerAddress,
            gasRefund: [hexlify32(0n), hexlify32(0n), hexlify32(0n), hexlify32(0n)],
            verifierArgs: context.proof.proof.verifyInputs,
        };

        return relayerRequest;
    }

    protected getRelayerPath(): string {
        return relayerPathConfig[Action.CURVE_LP_DEPOSIT];
    }

    protected async postExecute(context: CurveRemoveLiquidityContext): Promise<Note[]> {
        if (!context || !context.request || !context.tx || !context.outPartialNotes || !context.signature || !context.merkleRoot || !context.proof) {
            throw new DarkpoolError("Invalid context");
        }

        const outPut = await this.getOutAmounts(context.tx)
        if (!outPut || outPut.length == 0) {
            throw new DarkpoolError("Failed to find the CurveRemoveLiquidity event in the transaction receipt.");
        } else {
            let outNotes = [];
            for (let i = 0; i < 4; i++) {
                if (outPut[i].amount != null && outPut[i].amount != BigInt(0)) {
                    const outNote = await recoverNoteWithFooter(
                        context.outPartialNotes[i].rho,
                        context.outPartialNotes[i].asset,
                        BigInt(outPut[i].amount),
                        context.signature,
                    )

                    outNotes.push(outNote);
                }
            }

            if (outPut.length > 4 && outPut[4].amount != BigInt(0)) {
                const lpTokenChangeNote = await recoverNoteWithFooter(
                    context.outPartialNotes[4].rho,
                    context.outPartialNotes[4].asset,
                    BigInt(outPut[4].amount),
                    context.signature,
                )

                outNotes.push(lpTokenChangeNote);
            }

            return outNotes;
        }
    }

    private async getOutAmounts(tx: string) {
        let outPuts: { note: string; amount: bigint }[] = []
        const iface = new ethers.Interface(CurveRemoveLiquidityAssetManagerAbi.abi)
        const receipt = await darkPool.provider.getTransactionReceipt(tx)
        if (receipt && receipt.logs.length > 0) {
            const log = receipt.logs.find(
                (log) => log.topics[0] === 'CurveRemoveLiquidity',
            )
            if (log) {
                const event = iface.parseLog(log)
                console.log(event)
                if (event) {
                    for (let i = 0; i < 5; i++) {
                        outPuts.push({
                            note: event.args['notesOut'][i],
                            amount: event.args['amountsOut'][i],
                        })
                    }
                }
            }
        }

        return outPuts
    }
}