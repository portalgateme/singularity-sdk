import { DefiInfraProofResult, EMPTY_NOTE, Note, NoteType, PartialNote, createPartialNote, generateInfraProof, recoverNoteWithFooter } from "@thesingularitynetwork/darkpool-v1-proof";
import { ethers } from "ethers";
import { isEmpty } from "lodash";
import GeneralDefiIntegrationAssetManagerAbi from '../../abis/GeneralDefiIntegrationAssetManager.json';
import { Action, relayerPathConfig } from "../../config/config";
import { DarkPool } from "../../darkpool";
import { DarkpoolError } from "../../entities";
import { Relayer } from "../../entities/relayer";
import { DefiInfraRelayerRequest } from "../../entities/relayerRequestTypes";
import { hexlify32, isAddressEquals } from "../../utils/util";
import { BaseRelayerContext, BaseRelayerService, MultiNotesResult } from "../BaseService";
import { multiGetMerklePathAndRoot } from "../merkletree";

export interface DefiInfraRequest {
    inNoteTpye: NoteType;
    inNote1: Note | null;
    inNote2: Note | null;
    inNote3: Note | null;
    inNote4: Note | null;
    contractAddress: string;
    defiParameters: string;
    outNoteType: NoteType;
    outAsset1: string | null;
    outAsset2: string | null;
    outAsset3: string | null;
    outAsset4: string | null;
}

class DefiInfraContext extends BaseRelayerContext {
    private _request?: DefiInfraRequest;
    private _proof?: DefiInfraProofResult;
    private _inNotes?: Note[];
    private _outPartialNotes?: PartialNote[];

    constructor(relayer: Relayer, signature: string) {
        super(relayer, signature);
    }

    set request(request: DefiInfraRequest | undefined) {
        this._request = request;
    }

    get request(): DefiInfraRequest | undefined {
        return this._request;
    }

    set proof(proof: DefiInfraProofResult | undefined) {
        this._proof = proof;
    }

    get proof(): DefiInfraProofResult | undefined {
        return this._proof;
    }

    set inNotes(inNotes: Note[] | undefined) {
        this._inNotes = inNotes;
    }

    get inNotes(): Note[] | undefined {
        return this._inNotes;
    }

    set outPartialNotes(outPartialNotes: PartialNote[] | undefined) {
        this._outPartialNotes = outPartialNotes;
    }

    get outPartialNotes(): PartialNote[] | undefined {
        return this._outPartialNotes;
    }
}

export class DefiInfraService extends BaseRelayerService<DefiInfraContext, DefiInfraRelayerRequest, MultiNotesResult> {
    constructor(_darkPool: DarkPool) {
        super(_darkPool);
    }

    public async prepare(request: DefiInfraRequest, signature: string): Promise<{ context: DefiInfraContext, outPartialNotes: PartialNote[] }> {
        let outPartialNotes: PartialNote[] = []
        const outAssets = [request.outAsset1, request.outAsset2, request.outAsset3, request.outAsset4]
        for (let i = 0; i < 4; i++) {
            const asset = outAssets[i];
            if (asset && !isEmpty(asset) && !isAddressEquals(asset, ethers.ZeroAddress)) {
                const outPartialNote = await createPartialNote(asset, signature);
                outPartialNotes.push(outPartialNote);
            } else {
                outPartialNotes.push({
                    rho: 0n,
                    footer: 0n,
                    asset: ethers.ZeroAddress
                });
            }
        }

        const context = new DefiInfraContext(this._darkPool.getRelayer(), signature);
        context.request = request;
        context.outPartialNotes = outPartialNotes;
        return { context, outPartialNotes };
    }

    public async generateProof(context: DefiInfraContext): Promise<void> {
        if (!context || !context.request || !context.outPartialNotes || !context.signature) {
            throw new DarkpoolError("Invalid context");
        }

        let inNotes = [context.request.inNote1, context.request.inNote2, context.request.inNote3, context.request.inNote4];

        const paths = await multiGetMerklePathAndRoot(inNotes.filter(item => item !== null).map(item => item?.note) as bigint[], this._darkPool);
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

        context.inNotes = notes;

        const proof = await generateInfraProof({
            merkleRoot: root,
            merkleIndex1: noteMerkleIndex[0],
            merkleIndex2: noteMerkleIndex[1],
            merkleIndex3: noteMerkleIndex[2],
            merkleIndex4: noteMerkleIndex[3],
            merklePath1: noteMerklePath[0],
            merklePath2: noteMerklePath[1],
            merklePath3: noteMerklePath[2],
            merklePath4: noteMerklePath[3],
            inNoteType: context.request.inNoteTpye,
            inNote1: notes[0],
            inNote2: notes[1],
            inNote3: notes[2],
            inNote4: notes[3],
            contractAddress: context.request.contractAddress,
            defiParameters: context.request.defiParameters,
            outNoteType: context.request.outNoteType,
            outNotePartial1: context.outPartialNotes[0],
            outNotePartial2: context.outPartialNotes[1],
            outNotePartial3: context.outPartialNotes[2],
            outNotePartial4: context.outPartialNotes[3],
            relayer: context.relayer.relayerAddress,
            signedMessage: context.signature,
            options: this._darkPool.proofOptions
        });
        context.proof = proof;
    }


    protected async getRelayerRequest(context: DefiInfraContext): Promise<DefiInfraRelayerRequest> {
        if (!context
            || !context.request
            || !context.inNotes
            || !context.outPartialNotes
            || !context.signature
            || !context.merkleRoot
            || !context.proof) {
            throw new DarkpoolError("Invalid context");
        }

        const relayerRequest: DefiInfraRelayerRequest = {
            proof: context.proof.proof.proof,
            merkleRoot: context.merkleRoot,
            inNoteType: context.request.inNoteTpye,
            inNullifiers: [context.proof.inNullifier1, context.proof.inNullifier2, context.proof.inNullifier3, context.proof.inNullifier4],
            inAssets: [
                context.inNotes[0].asset,
                context.inNotes[1].asset,
                context.inNotes[2].asset,
                context.inNotes[3].asset],
            inAmountsOrNftIds: [
                hexlify32(context.inNotes[0].amount),
                hexlify32(context.inNotes[1].amount),
                hexlify32(context.inNotes[2].amount),
                hexlify32(context.inNotes[3].amount)],
            contractAddress: context.request.contractAddress,
            defiParameters: context.request.defiParameters,
            defiParameterHash: context.proof.defiParametersHash,
            outNoteType: context.request.outNoteType,
            outAssets: [
                context.outPartialNotes[0].asset,
                context.outPartialNotes[1].asset,
                context.outPartialNotes[2].asset,
                context.outPartialNotes[3].asset
            ],
            outNoteFooters: [
                hexlify32(context.outPartialNotes[0].footer),
                hexlify32(context.outPartialNotes[1].footer),
                hexlify32(context.outPartialNotes[2].footer),
                hexlify32(context.outPartialNotes[3].footer)
            ],
            relayer: context.relayer.relayerAddress,
            gasRefund: [hexlify32(0n), hexlify32(0n), hexlify32(0n), hexlify32(0n)],
            verifierArgs: context.proof.proof.verifyInputs,
        };

        console.log(relayerRequest);

        return relayerRequest;
    }

    protected getRelayerPath(): string {
        return relayerPathConfig[Action.DEFI_INFRA];
    }

    protected async postExecute(context: DefiInfraContext): Promise<MultiNotesResult> {
        if (!context
            || !context.request
            || !context.tx
            || !context.outPartialNotes
            || !context.signature
            || !context.merkleRoot
            || !context.proof) {
            throw new DarkpoolError("Invalid context");
        }

        const outPut = await this.getAmounts(context.tx)
        if (!outPut || outPut.length == 0) {
            throw new DarkpoolError("Failed to find the DefiIntegration event in the transaction receipt.");
        } else {
            let outNotes = [];
            for (let i = 0; i < 4; i++) {
                if (outPut[i] != BigInt(0)) {
                    const outNote = await recoverNoteWithFooter(
                        context.outPartialNotes[i].rho,
                        context.outPartialNotes[i].asset,
                        BigInt(outPut[i]),
                        context.signature,
                    )

                    outNotes.push(outNote);
                }
            }

            return { notes: outNotes, txHash: context.tx };
        }
    }

    private async getAmounts(tx: string) {
        const iface = new ethers.Interface(GeneralDefiIntegrationAssetManagerAbi.abi)
        const receipt = await this._darkPool.provider.getTransactionReceipt(tx)
        if (receipt && receipt.logs.length > 0) {
            for (let i = 0; i < receipt.logs.length; i++) {
                const parsedLog = iface.parseLog(receipt.logs[i]);
                if (parsedLog && parsedLog.name == 'DefiIntegration') {
                    return parsedLog.args[3]
                }
            }
        }

        return null
    }
}