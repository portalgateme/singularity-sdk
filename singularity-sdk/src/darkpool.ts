import { ethers } from 'ethers';
import { ContractConfiguartion, contractConfig } from './config/contractConfig';
import { StakingConfig, stakingTokenConfig } from './config/stakingConfig';
import { DarkpoolError } from './entities';
import { Relayer } from './entities/relayer';

export class DarkPool {
    signer: ethers.Signer;
    provider: ethers.Provider;
    chainId: number;
    relayers: Relayer[];
    contracts: ContractConfiguartion;
    stakingConfigs: StakingConfig[];

    constructor(
        signer: ethers.Signer,
        chainId: number,
        relayers: Relayer[],
        contracts?: ContractConfiguartion,
        stakingConfigs?: StakingConfig[],
    ) {
        // @ts-ignore
        this.signer = signer;
        // @ts-ignore
        this.provider = signer.provider;
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