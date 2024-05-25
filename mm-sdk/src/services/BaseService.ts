import { Note, PartialNote } from "@thesingularitynetwork/darkpool-v1-proof";
import axios from "axios";
import { Relayer } from "../entities/relayer";

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

    constructor(relayer: Relayer, signature: string) {
        super(signature);
        this._relayer = relayer;
    }

    get relayer(): Relayer {
        return this._relayer;
    }
}


export abstract class BaseContractService<T> {

    abstract prepare(...args: any[]): Promise<{ context: T, outNotes: Note[] }>;

    abstract generateProof(context: T): Promise<void>;

    abstract execute(context: T): Promise<string>;
}


export abstract class BaseRelayerService<T extends BaseRelayerContext, R> {

    abstract prepare(...args: any[]): Promise<{ context: T, outPartialNotes: PartialNote[] }>;

    abstract generateProof(context: T): Promise<void>;

    protected abstract getRelayerRequest(context: T): Promise<R>;

    protected abstract getRelayerPath(): string;

    protected abstract postExecute(context: T): Promise<any>;

    async execute(context: T): Promise<string> {
        const relayerRequest = await this.getRelayerRequest(context);
        const response = await axios.post(
            context.relayer.hostUrl + this.getRelayerPath(),
            relayerRequest,
        )
        if (response.status == 200) {
            return response.data.id
        } else if (response.status == 400) {
            throw new Error('Request error' + response.data.error)
        } else {
            throw new Error('Relayer not asscessable')
        }
    }
}