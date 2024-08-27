import { ChainId } from "../types"

export type ChainConfig = {
    name: string
    icon: string
    chainId: number
}

export const supportedChains: { [chainId: number]: ChainConfig } = {
    [ChainId.MAINNET]: {
        name: 'Ethereum',
        icon: '/images/chain/ethereum.png',
        chainId: ChainId.MAINNET
    },
    [ChainId.ARBITRUM_ONE]: {
        name: 'Arbitrum',
        icon: '/images/chain/arbitrum.svg',
        chainId: ChainId.ARBITRUM_ONE
    },
    [ChainId.POLYGON]: {
        name: 'Polygon',
        icon: '/images/chain/polygon.svg',
        chainId: ChainId.POLYGON
    },
    [ChainId.SEPOLIA]: {
        name: 'Sepolia',
        icon: '/images/chain/ethereum.png',
        chainId: ChainId.SEPOLIA
    },
    [ChainId.HARDHAT]: {
        name: 'Hardhat',
        icon: '/images/chain/ethereum.png',
        chainId: ChainId.HARDHAT
    },
    [ChainId.HARDHAT_ARBITRUM]: {
        name: 'Hardhat Arbitrum',
        icon: '/images/chain/arbitrum.svg',
        chainId: ChainId.HARDHAT_ARBITRUM
    },
    [ChainId.HARDHAT_POLYGON]: {
        name: 'Hardhat Polygon',
        icon: '/images/chain/polygon.svg',
        chainId: ChainId.HARDHAT_POLYGON
    },
    [ChainId.BounceBit]: {
        name: 'BounceBit',
        icon: '/images/chain/bouncebit.svg',
        chainId: ChainId.BounceBit
    },
    [ChainId.BounceBitTestnet]: {
        name: 'BounceBit Testnet',
        icon: '/images/chain/bouncebit.svg',
        chainId: ChainId.BounceBitTestnet
    },
}
