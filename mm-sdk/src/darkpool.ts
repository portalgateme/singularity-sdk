import { ethers } from 'ethers';
import { Relayer } from './entities/relayer';
import { ContractConfiguartion, contractConfig } from './config/contractConfig';
import { ChainId } from './config/chain';

class DarkPool {
    provider: ethers.JsonRpcProvider;
    chainId: number;
    relayers: Relayer[];
    contracts: ContractConfiguartion;

    constructor() {
        // @ts-ignore
        this.provider = null;
        this.chainId = ChainId.MAINNET;
        this.relayers = [];
        this.contracts = contractConfig[ChainId.MAINNET];
    }

    async init(
        rpcUrl: string,
        chainId: number,
        relayers: Relayer[],
        contracts?: ContractConfiguartion
    ) {
        this.provider = new ethers.JsonRpcProvider(rpcUrl);
        this.chainId = chainId;
        this.relayers = relayers;

        if (contracts) {
            this.contracts = contracts;
        } else {
            if (contractConfig[chainId]) {
                this.contracts = contractConfig[chainId];
            } else {
                throw new DarkpoolError('There is no default contract configuration for the provided chainId');
            }
        }
    }

    public getRelayer() {
        if (this.relayers.length === 0) {
            throw new DarkpoolError('Relayer is not initialized');
        }
        const index = Math.floor(Math.random() * this.relayers.length);
        return this.relayers[index];
    }
}


export const darkPool = new DarkPool();