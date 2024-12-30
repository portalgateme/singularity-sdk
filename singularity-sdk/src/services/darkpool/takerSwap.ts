// import { DOMAIN_NOTE, DarkPoolTakerSwapProofResult, Note, OTCSwapProofResult, createNoteWithPubKey, generateDarkPoolTakerSwapProof, generateOTCSwapProof } from "@thesingularitynetwork/darkpool-v1-proof";
// import { ethers } from "ethers";
// import OTCSwapAssetManagerAbi from '../../abis/OTCSwapAssetManager.json';
// import { DarkpoolError, Order, OTCSwapFullMessage } from "../../entities";
// import { BaseContext, BaseContractService } from "../BaseService";
// import { multiGetMerklePathAndRoot } from "../merkletree";
// import { fullSwapSecretFromString } from "./otcSwapDepositService";
// import { isAddressEquals } from "../../utils/util";
// import { DarkPool } from "../../darkpool";
// import { DarkPoolTakerSwapMessage } from "../../entities/darkpool";




// class TakerSwapContext extends BaseContext {
//     private _proof?: DarkPoolTakerSwapProofResult;
//     private _swapMessage?: OTCSwapFullMessage;

//     constructor(signature: string) {
//         super(signature);
//     }

//     set proof(proof: DarkPoolTakerSwapProofResult | undefined) {
//         this._proof = proof;
//     }

//     get proof(): DarkPoolTakerSwapProofResult | undefined {
//         return this._proof;
//     }

//     set swapMessage(swapMessage: OTCSwapFullMessage | undefined) {
//         this._swapMessage = swapMessage;
//     }

//     get swapMessage(): OTCSwapFullMessage | undefined {
//         return this._swapMessage;
//     }
// }

// export class TakerSwapService extends BaseContractService<TakerSwapContext> {
//     constructor(_darkPool?: DarkPool) {
//         super(_darkPool);
//     }

//     private checkSingleSwapMessage(swapMesage: DarkPoolTakerSwapMessage): boolean {
        

//         return true;
//     }

//     public async getMakerNewNoteAfterSwap(fullSwapMessageString: string): Promise<Note> {
//         const fullSwapMessage = fullSwapSecretFromString(this._darkPool.chainId, fullSwapMessageString);
//         const newMakerNote = await createNoteWithPubKey(
//             fullSwapMessage.makerNewRho,
//             fullSwapMessage.takerNote.asset,
//             fullSwapMessage.takerNote.amount,
//             fullSwapMessage.makerPubKey,
//             DOMAIN_NOTE
//         );
//         return newMakerNote;
//     }

//     public async getTakerNewNoteAfterSwap(fullSwapMessageString: string): Promise<Note> {
//         const fullSwapMessage = fullSwapSecretFromString(this._darkPool.chainId, fullSwapMessageString);
//         const newTakerNote = await createNoteWithPubKey(
//             fullSwapMessage.takerNewRho,
//             fullSwapMessage.makerNote.asset,
//             fullSwapMessage.makerNote.amount,
//             fullSwapMessage.takerPubKey,
//             DOMAIN_NOTE
//         );
//         return newTakerNote;
//     }

//     public async prepare(aliceSwapMessage: DarkPoolTakerSwapMessage, bobSwapMessage: DarkPoolTakerSwapMessage): Promise<{ context: TakerSwapContext, outNotes: Note[] }> {
//         if (!this.checkSingleSwapMessage(aliceSwapMessage, bobSwapMessage)) {
//             throw new DarkpoolError("Invalid full swap secret");
//         }
//         const context = new TakerSwapContext(aliceSwapMessage.swapSignature);
//         context.swapMessage = aliceSwapMessage;
//         return { context, outNotes: [] };
//     }

//     public async generateProof(context: TakerSwapContext): Promise<void> {
//         if (!context || !context.swapMessage) {
//             throw new DarkpoolError("Invalid context");
//         }

//         const merklePathes = await multiGetMerklePathAndRoot([context.swapMessage.makerNote.note, context.swapMessage.takerNote.note], this._darkPool);
//         const path1 = merklePathes[0];
//         const path2 = merklePathes[1];

//         context.merkleRoot = path1.root;

//         const makerNewNote = await createNoteWithPubKey(
//             context.swapMessage.makerNewRho,
//             context.swapMessage.takerNote.asset,
//             context.swapMessage.takerNote.amount,
//             context.swapMessage.makerPubKey,
//             DOMAIN_NOTE
//         )

//         const takerNewNote = await createNoteWithPubKey(
//             context.swapMessage.takerNewRho,
//             context.swapMessage.makerNote.asset,
//             context.swapMessage.makerNote.amount,
//             context.swapMessage.takerPubKey,
//             DOMAIN_NOTE
//         )



//         const proof = await generateDarkPoolTakerSwapProof({
//             merkleRoot: context.merkleRoot,
//             aliceMerkleIndex: path1.index,
//             aliceMerklePath: path1.path,
//             aliceOutNote: makerNewNote,
//             aliceOutNullifier: calcNullifier(makerNewNote.note),
//             aliceFeeAmount: context.swapMessage.makerNote.amount,
//             aliceInNoteNote: context.swapMessage.makerNote.note,
//             aliceInNoteRho: context.swapMessage.makerNote.rho,
//             aliceInNoteFooter: context.swapMessage.makerNote.footer,
//             aliceSignature: context.signature,
//             alicePubKey: context.swapMessage.makerPubKey,
//             bobMerkleIndex: path2.index,
//             bobMerklePath: path2.path,
//             bobOutNote: takerNewNote,
//             bobOutNullifier: calcNullifier(takerNewNote.note),
//             bobFeeAmount: context.swapMessage.takerNote.amount,
//             bobInNoteNote: context.swapMessage.takerNote.note,
//             bobInNoteRho: context.swapMessage.takerNote.rho,
//             bobInNoteFooter: context.swapMessage.takerNote.footer,
//             bobSignature: context.signature,
//             bobPubKey: context.swapMessage.takerPubKey,
//         });
//         context.proof = proof;
//     }

//     public async execute(context: TakerSwapContext): Promise<string> {
//         if (!context || !context.swapMessage || !context.signature || !context.proof) {
//             throw new DarkpoolError("Invalid context");
//         }
//         const signer = this._darkPool.signer;
//         const contract = new ethers.Contract(this._darkPool.contracts.otcSwapAssetManager, OTCSwapAssetManagerAbi.abi, signer);
//         const tx = await contract.swap(
//             context.merkleRoot,
//             context.proof.aliceNullifier,
//             context.proof.aliceNewNote,
//             context.proof.aliceNewNoteFooter,
//             context.proof.bobNullifier,
//             context.proof.bobNewNote,
//             context.proof.bobNewNoteFooter,
//             context.proof.proof.proof
//         );
//         return tx.hash;
//     }
// }