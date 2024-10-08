import { ethers } from 'ethers';
import { Relayer } from './entities/relayer';
import { ContractConfiguartion, contractConfig } from './config/contractConfig';
import { ChainId } from './config/chain';
import { DarkpoolError } from './entities';
import { StakingConfig, stakingTokenConfig } from './config/stakingConfig';

export class DarkPool {
    signer: ethers.Signer;
    provider: ethers.Provider;
    chainId: number;
    relayers: Relayer[];
    contracts: ContractConfiguartion;
    stakingConfigs: StakingConfig[];

    constructor() {
        // @ts-ignore
        this.signer = null;
        // @ts-ignore
        this.provider = null;
        this.chainId = ChainId.MAINNET;
        this.relayers = [];
        this.contracts = contractConfig[ChainId.MAINNET];
        this.stakingConfigs = stakingTokenConfig[ChainId.MAINNET];
    }

    async init(
        signer: ethers.Signer,
        chainId: number,
        relayers: Relayer[],
        contracts?: ContractConfiguartion,
        stakingConfigs?: StakingConfig[],
    ) {
        this.signer = signer;
        this.chainId = chainId;
        this.relayers = relayers;

        // @ts-ignore
        this.provider = signer.provider;

        if (contracts) {
            this.contracts = contracts;
        } else {
            if (contractConfig[chainId]) {
                this.contracts = contractConfig[chainId];
            } else {
                throw new DarkpoolError('There is no default contract configuration for the provided chainId');
            }
        }

        if (stakingConfigs) {
            this.stakingConfigs = stakingConfigs;
        } else {
            if (stakingTokenConfig[chainId]) {
                this.stakingConfigs = stakingTokenConfig[chainId];
            } else {
                this.stakingConfigs = [];
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