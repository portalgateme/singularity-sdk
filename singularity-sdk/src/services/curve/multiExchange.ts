// import { CurveMultiExchangeProofResult, Note, PartialNote, createPartialNote, generateCurveMultiExchangeProof, recoverNoteWithFooter } from "@thesingularitynetwork/darkpool-v1-proof";
// import { ethers } from "ethers";
// import CurveMultiExchangeAssetManagerAbi from '../../abis/CurveMultiExchangeAssetManager.json';
// import { Action, relayerPathConfig } from "../../config/config";
// import { darkPool } from "../../darkpool";
// import { Relayer } from "../../entities/relayer";
// import { CurveMultiExchangeRelayerRequest } from "../../entities/relayerRequestTypes";
// import { Token } from "../../entities/token";
// import { hexlify32 } from "../../utils/util";
// import { BaseRelayerContext, BaseRelayerService } from "../BaseService";
// import { getMerklePathAndRoot } from "../merkletree";
// import { DarkpoolError } from "../../entities";

// export interface CurveMultiExchangeRequest {
//     inNote: Note;
//     outAsset: Token;
//     route: {
//         pools: string[];
//         routes: string[];
//         swapParams: number[][];
//     };
//     minExpectedOutAmount: bigint;
// }

// class CurveMultiExchangeContext extends BaseRelayerContext {
//     private _request?: CurveMultiExchangeRequest;
//     private _proof?: CurveMultiExchangeProofResult;
//     private _outPartialNote?: PartialNote;

//     constructor(relayer: Relayer, signature: string) {
//         super(relayer, signature);
//     }

//     set request(request: CurveMultiExchangeRequest | undefined) {
//         this._request = request;
//     }

//     get request(): CurveMultiExchangeRequest | undefined {
//         return this._request;
//     }

//     set proof(proof: CurveMultiExchangeProofResult | undefined) {
//         this._proof = proof;
//     }

//     get proof(): CurveMultiExchangeProofResult | undefined {
//         return this._proof;
//     }

//     set outPartialNote(outPartialNote: PartialNote | undefined) {
//         this._outPartialNote = outPartialNote;
//     }

//     get outPartialNote(): PartialNote | undefined {
//         return this._outPartialNote;
//     }
// }

// export class CurveMultiExchangeService extends BaseRelayerService<CurveMultiExchangeContext, CurveMultiExchangeRelayerRequest> {
//     constructor() {
//         super();
//     }

//     public async prepare(request: CurveMultiExchangeRequest, signature: string): Promise<{ context: CurveMultiExchangeContext, outPartialNotes: PartialNote[] }> {
//         const outPartialNote = await createPartialNote(request.outAsset.address, signature);
//         const context = new CurveMultiExchangeContext(darkPool.getRelayer(), signature);
//         context.request = request;
//         context.outPartialNote = outPartialNote;
//         return { context, outPartialNotes: [outPartialNote] };
//     }

//     public async generateProof(context: CurveMultiExchangeContext): Promise<void> {
//         if (!context || !context.request || !context.outPartialNote || !context.signature) {
//             throw new DarkpoolError("Invalid context");
//         }

//         const path = await getMerklePathAndRoot(context.request.inNote.note);

//         const proof = await generateCurveMultiExchangeProof({
//             merkleRoot: path.root,
//             merklePath: path.path,
//             merkleIndex: path.index,
//             note: context.request.inNote,
//             pools: context.request.route.pools,
//             routes: context.request.route.routes,
//             swapParams: context.request.route.swapParams,
//             outNotePartial: context.outPartialNote,
//             minOutAmount: context.request.minExpectedOutAmount,
//             relayer: context.relayer.relayerAddress,
//             signedMessage: context.signature,
//         });
//         context.proof = proof;
//     }

//     protected async getRelayerRequest(context: CurveMultiExchangeContext): Promise<CurveMultiExchangeRelayerRequest> {
//         if (!context || !context.request || !context.outPartialNote || !context.signature || !context.merkleRoot || !context.proof) {
//             throw new DarkpoolError("Invalid context");
//         }

//         const swapRelayerRequest: CurveMultiExchangeRelayerRequest = {
//             proof: context.proof.proof.proof,
//             merkleRoot: context.merkleRoot,
//             nullifier: context.proof.inNullifier,
//             assetIn: context.request.inNote.asset,
//             amountIn: hexlify32(context.request.inNote.amount),
//             routes: context.request.route.routes,
//             swapParams: context.request.route.swapParams,
//             pools: context.request.route.pools,
//             routeHash: context.proof.routeHash,
//             assetOut: context.request.outAsset.address,
//             minExpectedAmountOut: hexlify32(context.request.minExpectedOutAmount),
//             noteFooterOut: hexlify32(context.outPartialNote.footer),
//             relayer: context.relayer.relayerAddress,
//             gasRefund: hexlify32(0n),
//             verifierArgs: context.proof.proof.verifyInputs,
//         };

//         return swapRelayerRequest;
//     }

//     protected getRelayerPath(): string {
//         return relayerPathConfig[Action.CURVE_MULTI_SWAP];
//     }

//     protected async postExecute(context: CurveMultiExchangeContext): Promise<Note[]> {
//         if (!context || !context.request || !context.tx || !context.outPartialNote || !context.signature || !context.merkleRoot || !context.proof) {
//             throw new DarkpoolError("Invalid context");
//         }

//         const [amountOut, noteCommitmentOut] = await this.getOutAmount(context.tx);
//         if (!amountOut || !noteCommitmentOut) {
//             throw new DarkpoolError("Failed to find the CurveExchange event in the transaction receipt.");
//         } else {
//             const outNote = await recoverNoteWithFooter(
//                 context.outPartialNote.rho,
//                 context.outPartialNote.asset,
//                 BigInt(amountOut),
//                 context.signature,
//             )

//             return [outNote];
//         }
//     }

//     private async getOutAmount(tx: string) : Promise<string[]>{
//         const iface = new ethers.Interface(CurveMultiExchangeAssetManagerAbi.abi)
//         const receipt = await darkPool.provider.getTransactionReceipt(tx)
//         if (receipt && receipt.logs.length > 0) {
//             const log = receipt.logs.find(
//                 (log) => log.topics[0] === 'CurveExchange',
//             )
//             if (log) {
//                 const event = iface.parseLog(log)
//                 if (event) {
//                     return [event.args[2] as string, event.args[3] as string];
//                 }
//             }
//         }

//         throw new DarkpoolError('Not able to find CurveExchange event in the receipt');
//     }
// }
