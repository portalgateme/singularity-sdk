import { Note, PartialNote } from '@thesingularitynetwork/darkpool-v1-proof';
import axios from 'axios';
import { Relayer } from '../entities/relayer';
import { DarkpoolError } from '../entities';
import { DarkPool } from '../darkpool';

export class BaseContext {
  private _signature: string;
  private _merkleRoot?: string;
  private _tx?: string;

  constructor(signature: string) {
    this._signature = signature;
  }

  get signature(): string {
    return this._signature;
  }

  set merkleRoot(merkleRoot: string | undefined) {
    this._merkleRoot = merkleRoot;
  }

  get merkleRoot(): string | undefined {
    return this._merkleRoot;
  }

  set tx(tx: string | undefined) {
    this._tx = tx;
  }

  get tx(): string | undefined {
    return this._tx;
  }
}

export class BaseRelayerContext extends BaseContext {
  private _relayer: Relayer;
  private _jobId?: string;

  constructor(relayer: Relayer, signature: string) {
    super(signature);
    this._relayer = relayer;
  }

  get relayer(): Relayer {
    return this._relayer;
  }

  set jobId(jobId: string | undefined) {
    this._jobId = jobId;
  }

  get jobId(): string | undefined {
    return this._jobId;
  }
}

export interface BaseRelayerResult {
  txHash: string;
}

export interface SingleNoteResult extends BaseRelayerResult {
  note: Note;
}

export interface MultiNotesResult extends BaseRelayerResult {
  notes: Note[];
}

export abstract class BaseContractService<T> {
  protected _darkPool: DarkPool;

  constructor(_darkPool: DarkPool) {
    this._darkPool = _darkPool;
  }

  abstract prepare(...args: any[]): Promise<{ context: T; outNotes: Note[] }>;

  abstract generateProof(context: T): Promise<void>;

  abstract execute(context: T): Promise<string>;
}

export abstract class BaseRelayerService<T extends BaseRelayerContext, R, S extends BaseRelayerResult> {
  protected _darkPool: DarkPool;

  constructor(_darkPool: DarkPool) {
    this._darkPool = _darkPool;
  }

  abstract prepare(...args: any[]): Promise<{ context: T; outPartialNotes: PartialNote[] }>;

  abstract generateProof(context: T): Promise<void>;

  protected abstract getRelayerRequest(context: T): Promise<R>;

  protected abstract getRelayerPath(): string;

  protected abstract postExecute(context: T): Promise<S>;

  async execute(context: T): Promise<string> {
    const relayerRequest = await this.getRelayerRequest(context);
    const response = await axios.post(context.relayer.hostUrl + this.getRelayerPath(), relayerRequest);
    if (response.status == 200) {
      context.jobId = response.data.id;
      return response.data.id;
    } else if (response.status == 400) {
      throw new Error('Request error' + response.data.error);
    } else {
      throw new Error('Relayer not asscessable');
    }
  }

  async executeAndWaitForResult(context: T): Promise<S> {
    await this.execute(context);

    const { error, txHash } = await this.pollJobStatus(context);

    console.log('relayer response, error and tx: ', error, txHash);

    if (error) {
      throw new DarkpoolError(error);
    }

    return await this.postExecute(context);
  }

  async pollJobStatus(context: T): Promise<{ error: string | undefined; txHash: string | undefined }> {
    let tries = 1;
    let txHash = undefined;
    while (tries <= 100) {
      if (tries >= 100) {
        break;
      }
      try {
        const response = await axios.get(`${context.relayer.hostUrl}/v1/jobs/${context.jobId}`);
        if (response.status === 400) {
          const { error } = response.data;
          console.log(error);
          return {
            error: 'Failed to submit transaction to relayer:' + error,
            txHash: undefined
          };
        }
        if (response.status === 200) {
          const { txHash, status, failedReason } = response.data;
          context.tx = txHash;

          if (status === 'FAILED') {
            return {
              error: failedReason ?? 'Transaction failed.',
              txHash: txHash
            };
          }
          if (status === 'CONFIRMED' || status === 'MINED') {
            return {
              error: undefined,
              txHash: txHash
            };
          }
        }
        await new Promise(resolve => setTimeout(resolve, 5000));
      } catch (error) {
        console.log(error);
      }
      tries++;
    }

    return {
      error: 'Waited too long for transaction to be mined.',
      txHash
    };
  }
}

export function transferCodeToNoteFooter(transferCode: string, chainId: number) {
  const params = transferCode.trim().split('-');
  if (params.length < 3 || params[0] != 'ONEOFF' || params[1] != 'RECIPIENT' || params[2] != chainId.toString()) {
    throw new DarkpoolError('Invalid receiver code');
  }
  return BigInt(params[3]);
}

export function validateRecipientCode(code: string) {
  const codePattern = /^(ONEOFF-RECIPIENT)-(\d+)-(\d+)/gm;
  return codePattern.test(code);
}
