import { CurveAddLiquidityProofResult, EMPTY_NOTE, Note, PartialNote, createPartialNote, generateCurveAddLiquidityProof, recoverNoteWithFooter } from "@thesingularitynetwork/darkpool-v1-proof";
import { ethers } from "ethers";
import CurveAddLiquidityAssetManagerAbi from '../../abis/CurveAddLiquidityAssetManager.json';
import { Action, relayerPathConfig } from "../../config/config";
import { darkPool } from "../../darkpool";
import { Relayer } from "../../entities/relayer";
import { CurveAddLiquidityRelayerRequest } from "../../entities/relayerRequestTypes";
import { hexlify32 } from "../../utils/util";
import { BaseRelayerContext, BaseRelayerService } from "../BaseService";
import { multiGetMerklePathAndRoot } from "../merkletree";
import { CurvePoolConfig } from "../../config/curveConfig";
import { getBooleanFlag, getPoolFlag, getPoolType } from "../defi/curveUtil";

export interface CurveAddLiquidityRequest {
    inNote1: Note | null;
    inNote2: Note | null;
    inNote3: Note | null;
    inNote4: Note | null;
    pool: CurvePoolConfig;
    isDepositWrapped: boolean;
    minExpectedOutAmount: bigint;
}

class CurveAddLiquidityContext extends BaseRelayerContext {
    private _request?: CurveAddLiquidityRequest;
    private _proof?: CurveAddLiquidityProofResult;
    private _outPartialNote?: PartialNote;

    constructor(relayer: Relayer, signature: string) {
        super(relayer, signature);
    }

    set request(request: CurveAddLiquidityRequest) {
        this._request = request;
    }

    get request(): CurveAddLiquidityRequest | undefined {
        return this._request;
    }

    set proof(proof: CurveAddLiquidityProofResult) {
        this._proof = proof;
    }

    get proof(): CurveAddLiquidityProofResult | undefined {
        return this._proof;
    }

    set outPartialNote(outPartialNote: PartialNote) {
        this._outPartialNote = outPartialNote;
    }

    get outPartialNote(): PartialNote | undefined {
        return this._outPartialNote;
    }
}

export class CurveAddLiquidityService extends BaseRelayerService<CurveAddLiquidityContext, CurveAddLiquidityRelayerRequest> {
    constructor() {
        super();
    }

    public async prepare(request: CurveAddLiquidityRequest, signature: string): Promise<{ context: CurveAddLiquidityContext, outPartialNotes: PartialNote[] }> {
        const outPartialNote = await createPartialNote(request.pool.lpToken, signature);
        const context = new CurveAddLiquidityContext(darkPool.getRelayer(), signature);
        context.request = request;
        context.outPartialNote = outPartialNote;
        return { context, outPartialNotes: [outPartialNote] };
    }

    public async generateProof(context: CurveAddLiquidityContext): Promise<void> {
        if (!context || !context.request || !context.outPartialNote || !context.signature) {
            throw new DarkpoolError("Invalid context");
        }

        let inNotes = [context.request.inNote1, context.request.inNote2, context.request.inNote3, context.request.inNote4];
        const paths = await multiGetMerklePathAndRoot(inNotes.map((note) => note ? note.note : undefined).filter((note) => note !== undefined) as bigint[]);
        const root = paths[0].root;
        context.merkleRoot = root;

        let notes: Note[] = []
        let noteMerklePath: string[][] = []
        let noteMerkleIndex: number[][] = []

        for (let i = 0; i < 4; i++) {
            const tempNote = inNotes[i]
            if (tempNote) {
                notes.push(tempNote)
                const path = paths.find((path) => path.noteCommitment === tempNote.note)
                if (path) {
                    noteMerklePath.push(path.path)
                    noteMerkleIndex.push(path.index)
                } else {
                    throw new DarkpoolError('Merkle path not found for note:' + tempNote.note)
                }
            } else {
                notes.push(EMPTY_NOTE)
                noteMerklePath.push(Array(32).fill('0x0'))
                noteMerkleIndex.push(Array(32).fill(0))
            }
        }

        const booleanFlag = getBooleanFlag(context.request.pool, context.request.isDepositWrapped);
        const poolFlag = getPoolFlag(context.request.pool, context.request.isDepositWrapped);


        const proof = await generateCurveAddLiquidityProof({
            merkleRoot: root,
            merkleIndex1: paths[0].index,
            merkleIndex2: paths[1].index,
            merkleIndex3: paths[2].index,
            merkleIndex4: paths[3].index,
            merklePath1: paths[0].path,
            merklePath2: paths[1].path,
            merklePath3: paths[2].path,
            merklePath4: paths[3].path,
            note1: notes[0],
            note2: notes[1],
            note3: notes[2],
            note4: notes[3],
            pool: context.request.pool.address,
            poolFlag: BigInt(poolFlag),
            booleanFlag,
            minMintAmount: context.request.minExpectedOutAmount,
            outNotePartial: context.outPartialNote,
            relayer: context.relayer.relayerAddress,
            signedMessage: context.signature,
        });
        context.proof = proof;
    }


    protected async getRelayerRequest(context: CurveAddLiquidityContext): Promise<CurveAddLiquidityRelayerRequest> {
        if (!context
            || !context.request
            || !context.request.inNote1
            || !context.request.inNote2
            || !context.request.inNote3
            || !context.request.inNote4
            || !context.outPartialNote
            || !context.signature
            || !context.merkleRoot
            || !context.proof) {
            throw new DarkpoolError("Invalid context");
        }

        const booleanFlag = getBooleanFlag(context.request.pool, context.request.isDepositWrapped);
        const poolFlag = getPoolFlag(context.request.pool, context.request.isDepositWrapped);

        const relayerRequest: CurveAddLiquidityRelayerRequest = {
            proof: context.proof.proof.proof,
            merkleRoot: context.merkleRoot,
            nullifiers: [context.proof.nullifier1, context.proof.nullifier2, context.proof.nullifier3, context.proof.nullifier4],
            assets: [
                context.request.inNote1.asset,
                context.request.inNote2.asset,
                context.request.inNote3.asset,
                context.request.inNote4.asset],
            amounts: [
                hexlify32(context.request.inNote1.amount),
                hexlify32(context.request.inNote2.amount),
                hexlify32(context.request.inNote3.amount),
                hexlify32(context.request.inNote4.amount)],
            pool: context.request.pool.address,
            poolType: getPoolType(context.request.pool, context.request.isDepositWrapped),
            basePoolType: context.request.pool.basePoolType || 0,
            lpToken: context.request.pool.lpToken,
            poolFlag: hexlify32(poolFlag),
            booleanFlag,
            minMintAmount: hexlify32(context.request.minExpectedOutAmount),
            noteFooter: hexlify32(context.outPartialNote.footer),
            relayer: context.relayer.relayerAddress,
            gasRefund: [hexlify32(0n), hexlify32(0n), hexlify32(0n), hexlify32(0n)],
            verifierArgs: context.proof.proof.verifyInputs,
        };

        return relayerRequest;
    }

    protected getRelayerPath(): string {
        return relayerPathConfig[Action.CURVE_LP_DEPOSIT];
    }

    protected async postExecute(context: CurveAddLiquidityContext): Promise<Note[]> {
        if (!context || !context.request || !context.tx || !context.outPartialNote || !context.signature || !context.merkleRoot || !context.proof) {
            throw new DarkpoolError("Invalid context");
        }

        const [amountOut, noteCommitmentOut] = await this.getLPtokenAndAmount(context.tx);
        if (!amountOut || !noteCommitmentOut) {
            throw new DarkpoolError("Failed to find the CurveAddLiquidity event in the transaction receipt.");
        } else {
            const outNote = await recoverNoteWithFooter(
                context.outPartialNote.rho,
                context.outPartialNote.asset,
                BigInt(amountOut),
                context.signature,
            )

            return [outNote];
        }
    }

    private async getLPtokenAndAmount(tx: string) {
        const iface = new ethers.Interface(CurveAddLiquidityAssetManagerAbi.abi)
        const receipt = await darkPool.provider.getTransactionReceipt(tx)
        if (receipt && receipt.logs.length > 0) {
            const log = receipt.logs.find(
                (log) => log.topics[0] === 'CurveAddLiquidity',
            )
            if (log) {
                const event = iface.parseLog(log)
                if (event) {
                    return [event.args['amountOut'], event.args['noteOut']]
                }
            }
        }

        return [null, null]
    }
}