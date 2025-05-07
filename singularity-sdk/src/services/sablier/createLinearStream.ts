import {
  SablierCreateStreamProofResult,
  generateSablierCreateLinearStreamProof,
  PartialNote,
  createPartialNote,
  SablierLinearStream,
  SABLIER_LINEAR_STREAM_TYPE
} from '@thesingularitynetwork/darkpool-v1-proof';
import { Token } from '../../entities/token';
import { hexlify16, hexlify32, hexlify5 } from '../../utils/util';
import { BaseContext } from '../BaseService';
import { ethers } from 'ethers';
import SablierLinearAssetManagerAbi from '../../abis/SablierLinearAssetManager.json';
import { DarkpoolError } from '../../entities';
import { DarkPool } from '../../darkpool';
import IERC20Abi from '../../abis/IERC20.json';

class CreateLinearStreamSablierContext extends BaseContext {
  private _inAsset?: Token;
  private _outPartialNotes?: PartialNote[];
  private _address?: string;
  private _totalAmount?: bigint;
  private _streamType?: SABLIER_LINEAR_STREAM_TYPE;
  private _proof?: SablierCreateStreamProofResult;
  private _streams?: SablierLinearStream[];
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

  set streamType(streamType: SABLIER_LINEAR_STREAM_TYPE | undefined) {
    this._streamType = streamType;
  }

  get streamType(): SABLIER_LINEAR_STREAM_TYPE | undefined {
    return this._streamType;
  }

  set proof(proof: SablierCreateStreamProofResult | undefined) {
    this._proof = proof;
  }

  get proof(): SablierCreateStreamProofResult | undefined {
    return this._proof;
  }

  set streams(streams: SablierLinearStream[] | undefined) {
    this._streams = streams;
  }

  get streams(): SablierLinearStream[] | undefined {
    return this._streams;
  }
}

export class CreateLinearStreamSablierService extends CreateLinearStreamSablierContext {
  constructor(_darkPool: DarkPool) {
    super('', _darkPool);
  }

  public async prepare(
    inAsset: Token,
    walletAddress: string,
    streamType: SABLIER_LINEAR_STREAM_TYPE,
    asset: string,
    streams: SablierLinearStream[],
    isCancelability: boolean,
    isTransferability: boolean,
    signature: string
  ): Promise<{ context: CreateLinearStreamSablierContext; outNotes: PartialNote[] }> {
    const outNotes = await Promise.all(
      new Array(streams.length).fill('').map(async () => {
        const partialNote = await createPartialNote(asset, signature);

        return partialNote;
      })
    );

    const context = new CreateLinearStreamSablierContext(signature, this._darkPool);
    context.inAsset = inAsset;
    context.outPartialNotes = outNotes;
    context.address = walletAddress;
    context.streamType = streamType;
    context.totalAmount = streams.reduce((acc, stream) => acc + stream.amount, BigInt(0));

    context.streams = streams.map(stream => {
      let cliff = stream.cliff;
      if (streamType === SABLIER_LINEAR_STREAM_TYPE.RANGE && cliff === 0n) {
        cliff = stream.start;
      }
      return {
        ...stream,
        cliff: cliff,
        cancelable: isCancelability,
        transferable: isTransferability
      };
    });
    return { context, outNotes: outNotes };
  }

  public async generateProof(context: CreateLinearStreamSablierContext): Promise<void> {
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
    const proof = await generateSablierCreateLinearStreamProof({
      streams: context.streams as SablierLinearStream[],
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

  public async execute(context: CreateLinearStreamSablierContext): Promise<string> {
    if (!context || !context.proof || !this._darkPool.contracts.sablierConfig) {
      throw new DarkpoolError('Execute: Invalid context');
    }
    const contractParam = this.getContractCallParameters(context);
    const signer = this._darkPool.signer;
    const contract = new ethers.Contract(
      this._darkPool.contracts.sablierConfig.sablierLinearAssetManager,
      SablierLinearAssetManagerAbi.abi,
      signer
    );

    await this.allowance(context);
    const tx = await contract.createLinearStream(context.proof.proof.proof, [...contractParam]);
    return tx.hash;
  }

  protected async allowance(context: CreateLinearStreamSablierContext) {
    if (!this._darkPool || !this._darkPool.contracts.sablierConfig || !context.inAsset || !context.totalAmount) {
      throw new DarkpoolError('Allowance: Invalid context');
    }

    const signer = this._darkPool.signer;
    const contract = new ethers.Contract(context.inAsset.address, IERC20Abi.abi, signer);
    const allowance = (await contract.allowance(
      context.address,
      this._darkPool.contracts.sablierConfig.sablierLinearAssetManager
    )) as bigint;

    if (allowance < context.totalAmount) {
      await contract.approve(this._darkPool.contracts.sablierConfig.sablierLinearAssetManager, context.totalAmount);
    }
  }

  public getContractCallParameters(context: CreateLinearStreamSablierContext) {
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
        cliff: hexlify5(stream.cliff),
        total: hexlify5(stream.total),
        start: hexlify5(stream.start),
        end: hexlify5(stream.end)
      };
    });

    return [
      context.inAsset.address,
      hexlify16(context.totalAmount),
      hexlify16(BigInt(context.streamType)),
      hexlify16(context.outPartialNotes.length),
      formatStreams,
      context.proof.streamParametersHash,
      this._darkPool.contracts.sablierConfig.lockupLinear,
      arrNoteFooter
    ];
  }
}
