import { ChainId, TokenConfig } from '../types'

export const legacyTokenConfig: { [chainId: number]: string[] } = {
  [ChainId.SEPOLIA]: [],
  [ChainId.ARBITRUM_ONE]: [],
  [ChainId.HARDHAT]: ["0xdac17f958d2ee523a2206206994597c13d831ec7"],
}

export const tokenConfig: { [chainId: string]: TokenConfig[] } = {
  [ChainId.SEPOLIA]: [
    {
      name: 'SepoliaETH',
      symbol: 'SepoliaETH',
      decimals: 18,
      address: '0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE',
      logoURI: '/images/token/ETH.png',
      isTop: true,
    },
    {
      name: 'Wrapped Ether',
      symbol: 'WETH',
      decimals: 18,
      address: '0xfFf9976782d46CC05630D1f6eBAb18b2324d6B14',
      logoURI: '/images/token/WETH.png',
      isTop: true,
    },
    {
      name: 'Uniswap',
      symbol: 'UNI',
      decimals: 18,
      address: '0x1f9840a85d5af5bf1d1762f925bdaddc4201f984',
      popular: true,
    },
  ],
  [ChainId.HARDHAT]: [
    {
      name: 'ETH',
      symbol: 'ETH',
      decimals: 18,
      address: '0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE',
      logoURI: '/images/token/ETH.png',
      isTop: true,
    },
    {
      name: 'Tether USD',
      symbol: 'USDT',
      decimals: 6,
      address: '0xdac17f958d2ee523a2206206994597c13d831ec7',
      logoURI: '/images/token/USDT.png',
      isTop: true,
    },
    {
      name: 'USD Coin',
      symbol: 'USDC',
      decimals: 6,
      address: '0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48',
      logoURI: '/images/token/USDC.png',
      isTop: true,
    },
    {
      name: 'Wrapped BTC',
      symbol: 'WBTC',
      decimals: 8,
      address: '0x2260fac5e5542a773aa44fbcfedf7c193bc2c599',
      logoURI: '/images/token/WBTC.png',
      isTop: true,
    },
    {
      name: 'Dai Stablecoin',
      symbol: 'DAI',
      decimals: 18,
      address: '0x6b175474e89094c44da98b954eedeac495271d0f',
      logoURI: '/images/token/DAI.png',
      isTop: true,
    },
    {
      name: 'BNB',
      symbol: 'BNB',
      decimals: 18,
      address: '0xB8c77482e45F1F44dE1745F52C74426C631bDD52',
    },
    {
      name: 'Wrapped ETH',
      symbol: 'WETH',
      decimals: 18,
      address: '0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2',
      logoURI: '/images/token/WETH.png',
      isTop: true,
    },
    {
      name: 'TRON',
      symbol: 'TRX',
      decimals: 6,
      address: '0xf230b790e05390fc8295f4d3f60332c93bed42e2',
      popular: true,
    },
    {
      name: 'ChainLink Token',
      symbol: 'LINK',
      decimals: 18,
      address: '0x514910771af9ca656af840dff83e8264ecf986ca',
      popular: true,
    },
    {
      name: 'Uniswap',
      symbol: 'UNI',
      decimals: 18,
      address: '0x1f9840a85d5af5bf1d1762f925bdaddc4201f984',
      popular: true,
    },
    {
      name: 'Wrapped TON Coin',
      symbol: 'TONCOIN',
      decimals: 18,
      address: '0x582d872a1b094fc48f5de31d3b73f2d9be47def1',

      popular: true,
    },
    {
      name: 'SHIBA INU',
      symbol: 'SHIB',
      decimals: 18,
      address: '0x95ad61b0a150d79219dcf64e1e6cc01f0b64c4ce',
      popular: true,
    },
    {
      name: 'MockBTC',
      symbol: 'MockBTC',
      decimals: 18,
      address: '0x5fbdb2315678afecb367f032d93f642f64180aa3',
    },
    {
      name: 'sgETH',
      symbol: 'sgETH',
      decimals: 18,
      address: '0x30A6d2B697635a0ECf1975d2386A0FE6b608B0Fb',
      logoURI: '/images/token/sgETH.svg',
    },
    {
      name: 'sgUSDC',
      symbol: 'sgUSDC',
      decimals: 6,
      address: '0xCd9BC6cE45194398d12e27e1333D5e1d783104dD',
      logoURI: '/images/token/sgUSDC.svg',
    },
    {
      name: 'Rocket Pool Token',
      symbol: 'rETH',
      decimals: 18,
      address: '0xae78736cd615f374d3085123a210448e74fc6393',
      logoURI: '/images/token/rETH.png',
      isTop: true,
    }
  ]
}