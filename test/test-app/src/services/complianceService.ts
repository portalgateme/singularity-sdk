import { readContract } from '@wagmi/core';
import { wagmiConfig } from '../wagmi';
import complianceManagerAbi from '../abis/darkpool/IComplianceManager.json';
import { networkConfig } from '../constants/networkConfig';
import { ethers } from 'ethers';

export async function isAddressCompliance(address: string, chainId: number): Promise<boolean> {
    if (!address
        || !ethers.isAddress(address)
        || !chainId
    ) {
        return false;
    }


    return await readContract(
        wagmiConfig,
        {
            address: networkConfig[chainId].complianceManager,
            abi: complianceManagerAbi.abi,
            functionName: 'isAuthorized',
            args: [
                networkConfig[chainId].darkpoolAssetManager,
                address
            ]
        }
    ) as boolean;
}