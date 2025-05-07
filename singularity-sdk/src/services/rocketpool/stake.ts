import {
  createPartialNote,
  generateRocketPoolStakeProof,
  Note,
  PartialNote,
  recoverNoteWithFooter,
  RocketPoolStakeProofResult
} from '@thesingularitynetwork/darkpool-v1-proof';
import RocketPoolStakeAssetManagerAbi from '../../abis/RocketPoolStakeAssetManager.json';
import { Action, relayerPathConfig } from '../../config/config';
import { DarkPool } from '../../darkpool';
import { DarkpoolError, Relayer, StakeRocketPoolRelayerRequest, Token } from '../../entities';
import { hexlify32 } from '../../utils/util';
import { BaseRelayerContext, BaseRelayerService, SingleNoteResult } from '../BaseService';
import { getOutEvent } from '../EventService';
import { getMerklePathAndRoot } from '../merkletree';

class StakeRocketPoolContext extends BaseRelayerContext {
  private _inNote?: Note;
  private _outNotePartial?: PartialNote;
  private _proof?: RocketPoolStakeProofResult;

  constructor(relayer: Relayer, signature: string) {
    super(relayer, signature);
  }

  set inNote(inAsset: Note | undefined) {
    this._inNote = inAsset;
  }

  get inNote(): Note | undefined {
    return this._inNote;
  }

  set outNotePartial(note: PartialNote | undefined) {
    this._outNotePartial = note;
  }

  get outNotePartial(): PartialNote | undefined {
    return this._outNotePartial;
  }

  set proof(proof: RocketPoolStakeProofResult | undefined) {
    this._proof = proof;
  }

  get proof(): RocketPoolStakeProofResult | undefined {
    return this._proof;
  }
}

export class StakeNoteRocketPoolService extends BaseRelayerService<
  StakeRocketPoolContext,
  StakeRocketPoolRelayerRequest,
  SingleNoteResult
> {
  constructor(_darkPool: DarkPool) {
    super(_darkPool);
  }

  public async prepare(
    inNote: Note,
    outAsset: Token,
    signature: string
  ): Promise<{ context: StakeRocketPoolContext; outPartialNotes: PartialNote[] }> {
    const outNotePartial = await createPartialNote(outAsset.address, signature);

    const context = new StakeRocketPoolContext(this._darkPool.getRelayer(), signature);
    context.inNote = inNote;
    context.outNotePartial = outNotePartial;
    return { context, outPartialNotes: [outNotePartial] };
  }

  public async generateProof(context: StakeRocketPoolContext): Promise<void> {
    if (!context || !context.inNote || !context.outNotePartial || !context.signature) {
      throw new DarkpoolError('Invalid context');
    }

    const path = await getMerklePathAndRoot(context.inNote.note, this._darkPool);

    const proof = await generateRocketPoolStakeProof({
      merkleRoot: path.root,
      merklePath: path.path,
      merkleIndex: path.index,
      note: context.inNote,
      outNotePartial: context.outNotePartial,
      relayer: context.relayer.relayerAddress,
      signedMessage: context.signature,
      options: this._darkPool.proofOptions
    });
    context.proof = proof;
    context.merkleRoot = path.root;
  }

  public async getRelayerRequest(context: StakeRocketPoolContext): Promise<StakeRocketPoolRelayerRequest> {
    if (
      !context ||
      !context.inNote ||
      !context.outNotePartial ||
      !context.signature ||
      !context.merkleRoot ||
      !context.proof
    ) {
      throw new DarkpoolError('Invalid context');
    }

    const relayerRequest: StakeRocketPoolRelayerRequest = {
      amount: hexlify32(context.inNote.amount),
      noteFooterOut: hexlify32(context.outNotePartial.footer),
      nullifier: context.proof.inNullifier,
      refund: hexlify32(0n),
      proof: context.proof.proof.proof,
      merkleRoot: context.merkleRoot,
      relayer: context.relayer.relayerAddress,
      verifierArgs: context.proof.proof.verifyInputs
    };

    return relayerRequest;
  }

  public getRelayerPath(): string {
    return relayerPathConfig[Action.ROCKET_POOL_STAKE];
  }

  public async postExecute(context: StakeRocketPoolContext): Promise<SingleNoteResult> {
    if (!context || !context.outNotePartial || !context.signature) {
      throw new DarkpoolError('Invalid context');
    }

    if (!context.tx) {
      throw new DarkpoolError('No transaction hash');
    }

    const event = await getOutEvent(context.tx, RocketPoolStakeAssetManagerAbi.abi, 'RocketDeposit', this._darkPool);

    if (!event || !event.args || !event.args[1]) {
      throw new DarkpoolError('Can not find Locked Event from transaction: ' + context.tx);
    }

    const outAmount = event.args[1];
    const outNote = await recoverNoteWithFooter(
      context.outNotePartial.rho,
      context.outNotePartial.asset,
      BigInt(outAmount),
      context.signature
    );
    return { note: outNote, txHash: context.tx! };
  }
}
