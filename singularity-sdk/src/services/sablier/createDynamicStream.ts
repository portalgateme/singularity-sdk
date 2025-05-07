import {
  SablierCreateStreamProofResult,
  PartialNote,
  createPartialNote,
  SABLIER_DYNAMIC_STREAM_TYPE,
  SablierDynamicStream,
  generateSablierCreateDynamicStreamProof
} from '@thesingularitynetwork/darkpool-v1-proof';
import { Token } from '../../entities/token';
import { hexlify16, hexlify32, hexlify5, hexlify8 } from '../../utils/util';
import { BaseContext } from '../BaseService';
import { ethers, toBeHex } from 'ethers';
import { DarkpoolError } from '../../entities';
import { DarkPool } from '../../darkpool';
import IERC20Abi from '../../abis/IERC20.json';

import SablierDynamicAssetManagerAbi from '../../abis/SablierDynamicAssetManager.json';
class CreateDynamicStreamSablierContext extends BaseContext {
  private _inAsset?: Token;
  private _outPartialNotes?: PartialNote[];
  private _address?: string;
  private _totalAmount?: bigint;
  private _streamType?: SABLIER_DYNAMIC_STREAM_TYPE;
  private _proof?: SablierCreateStreamProofResult;
  private _streams?: SablierDynamicStream[];
  protected _darkPool: DarkPool;

  constructor(signature: string, darkpool: DarkPool) {
    super(signature);
    this._darkPool = darkpool;
  }

  set inAsset(inAsset: Token | undefined) {
    this._inAsset = inAsset;
  }

  get inAsset(): Token | undefined {
    return this._inAsset;
  }

  set outPartialNotes(notes: PartialNote[] | undefined) {
    this._outPartialNotes = notes;
  }

  get outPartialNotes(): PartialNote[] | undefined {
    return this._outPartialNotes;
  }

  set address(address: string | undefined) {
    this._address = address;
  }

  get address(): string | undefined {
    return this._address;
  }

  set totalAmount(totalAmount: bigint | undefined) {
    this._totalAmount = totalAmount;
  }

  get totalAmount(): bigint | undefined {
    return this._totalAmount;
  }

  set streamType(streamType: SABLIER_DYNAMIC_STREAM_TYPE | undefined) {
    this._streamType = streamType;
  }

  get streamType(): SABLIER_DYNAMIC_STREAM_TYPE | undefined {
    return this._streamType;
  }

  set proof(proof: SablierCreateStreamProofResult | undefined) {
    this._proof = proof;
  }

  get proof(): SablierCreateStreamProofResult | undefined {
    return this._proof;
  }

  set streams(streams: SablierDynamicStream[] | undefined) {
    this._streams = streams;
  }

  get streams(): SablierDynamicStream[] | undefined {
    return this._streams;
  }
}

export class CreateDynamicStreamSablierService extends CreateDynamicStreamSablierContext {
  constructor(_darkPool: DarkPool) {
    super('', _darkPool);
  }

  public async prepare(
    inAsset: Token,
    walletAddress: string,
    streamType: SABLIER_DYNAMIC_STREAM_TYPE,
    asset: string,
    streams: SablierDynamicStream[],
    isCancelability: boolean,
    isTransferability: boolean,
    signature: string
  ): Promise<{ context: CreateDynamicStreamSablierContext; outNotes: PartialNote[] }> {
    const outNotes = await Promise.all(
      new Array(streams.length).fill('').map(async () => {
        const partialNote = await createPartialNote(asset, signature);

        return partialNote;
      })
    );

    const context = new CreateDynamicStreamSablierContext(signature, this._darkPool);
    context.inAsset = inAsset;
    context.outPartialNotes = outNotes;
    context.address = walletAddress;
    context.streamType = streamType;
    context.totalAmount = streams.reduce((acc, stream) => acc + stream.amount, BigInt(0));

    context.streams = streams.map(stream => {
      return {
        ...stream,
        cancelable: isCancelability,
        transferable: isTransferability
      };
    });
    return { context, outNotes: outNotes };
  }

  public async generateProof(context: CreateDynamicStreamSablierContext): Promise<void> {
    if (
      !context ||
      !context.inAsset ||
      !context.outPartialNotes ||
      !context.address ||
      !context.signature ||
      !context.streamType ||
      !context.streams ||
      !context.totalAmount
    ) {
      throw new DarkpoolError('Generate proof: Invalid context');
    }
    const proof = await generateSablierCreateDynamicStreamProof({
      streams: context.streams,
      address: context.address,
      asset: context.inAsset.address,
      amount: context.totalAmount,
      streamType: context.streamType,
      streamSize: context.streams.length,
      outNotePartials: context.outPartialNotes,
      signedMessage: context.signature
    });
    context.proof = proof;
  }

  public async execute(context: CreateDynamicStreamSablierContext): Promise<string> {
    if (!context || !this._darkPool || !this._darkPool.contracts.sablierConfig || !context.proof) {
      throw new DarkpoolError('Execute: Invalid context');
    }
    const contractParam = this.getContractCallParameters(context);
    const signer = this._darkPool.signer;
    const contract = new ethers.Contract(
      this._darkPool.contracts.sablierConfig.sablierDynamicAssetManager,
      SablierDynamicAssetManagerAbi.abi,
      signer
    );
    await this.allowance(context);
    const tx = await contract.createDynamicStream(context.proof.proof.proof, [...contractParam]);
    return tx.hash;
  }

  protected async allowance(context: CreateDynamicStreamSablierContext) {
    if (!this._darkPool || !this._darkPool.contracts.sablierConfig || !context.inAsset || !context.totalAmount) {
      throw new DarkpoolError('Allowance: Invalid context');
    }

    const signer = this._darkPool.signer;
    const contract = new ethers.Contract(context.inAsset.address, IERC20Abi.abi, signer);
    const allowance = (await contract.allowance(
      context.address,
      this._darkPool.contracts.sablierConfig.sablierDynamicAssetManager
    )) as bigint;

    if (allowance < context.totalAmount) {
      await contract.approve(this._darkPool.contracts.sablierConfig.sablierDynamicAssetManager, context.totalAmount);
    }
  }

  public getContractCallParameters(context: CreateDynamicStreamSablierContext) {
    if (
      !context ||
      !context.inAsset ||
      !context.outPartialNotes ||
      !context.address ||
      !context.signature ||
      !context.proof ||
      !context.totalAmount ||
      !context.streams ||
      !context.streamType ||
      !this._darkPool ||
      !this._darkPool.contracts.sablierConfig
    ) {
      throw new DarkpoolError('Get contract call parameters: Invalid context');
    }

    const arrNoteFooter = context.outPartialNotes.map(note => hexlify32(note.footer));
    const formatStreams = context.streams.map(stream => {
      return {
        amount: hexlify16(stream.amount),
        cancelable: stream.cancelable,
        transferable: stream.transferable,
        startTime: hexlify5(stream.startTime),
        segments: stream.segments.map(segment => {
          return {
            amount: hexlify16(segment.amount),
            exponent: hexlify8(segment.exponent),
            milestoneOrDelta: toBeHex(segment.milestoneOrDelta)
          };
        })
      };
    });

    return [
      context.inAsset.address,
      hexlify32(context.totalAmount),
      hexlify32(context.streamType),
      hexlify32(context.outPartialNotes.length),
      formatStreams,
      context.proof.streamParametersHash,
      this._darkPool.contracts.sablierConfig.lockupDynamic,
      arrNoteFooter
    ];
  }
}
