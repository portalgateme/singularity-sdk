import { ethers } from 'ethers';
import { config } from '../constants';


const provider = new ethers.JsonRpcProvider(config.rpcUrl);
const oracleProvider = new ethers.JsonRpcProvider(config.rpcUrl);

export const getOracleProviderByChainId = () => {
    return oracleProvider;
}

export const getProviderByChainId = () => {
    return provider
}