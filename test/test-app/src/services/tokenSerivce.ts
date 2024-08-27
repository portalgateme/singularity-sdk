import { readContracts } from '@wagmi/core'
import { wagmiConfig } from '../wagmi';
import ERC20 from '../abis/ERC20.json';
import { Abi } from 'viem';
import { DarkpoolError, HexData, TokenConfig } from '../types';
import { tokenConfig as tokens } from '../constants/tokenConfig';

export const getTokenByChain = async (tokenAddress: string, chainId: number) => {
    const tokenConfig = tokens[chainId].find((token) => token.address.toLowerCase() === tokenAddress.toLowerCase());

    if (tokenConfig)
        return tokenConfig;

    return getTokenFromAddress(tokenAddress);
}

export const getTokenFromAddress = async (tokenAddress: string): Promise<TokenConfig> => {
    try {
        const result = await readContracts(wagmiConfig, {
            contracts: [
                {
                    address: tokenAddress as HexData,
                    abi: ERC20.abi as Abi,
                    functionName: 'symbol',
                    args: [],
                },
                {
                    address: tokenAddress as HexData,
                    abi: ERC20.abi as Abi,
                    functionName: 'decimals',
                    args: [],
                },
                {
                    address: tokenAddress as HexData,
                    abi: ERC20.abi as Abi,
                    functionName: 'name',
                    args: [],
                },
            ]
        });

        if (result[0].status == "success" && result[1].status == "success" && result[2].status == "success") {
            return {
                symbol: result[0].result as string,
                decimals: result[1].result as number,
                name: result[2].result as string,
                address: tokenAddress,
            }
        } else {
            throw new DarkpoolError('Error fetching token, please retry.');
        }
    } catch (e) {
        throw new DarkpoolError('Error fetching token, please retry.');
    }
}