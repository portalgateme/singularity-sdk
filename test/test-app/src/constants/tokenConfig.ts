import { ChainId, TokenConfig } from '../types'

export const legacyTokenConfig: { [chainId: number]: string[] } = {
  [ChainId.SEPOLIA]: [],
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
    // {
    //   name: 'Tether USD',
    //   symbol: 'USDT',
    //   decimals: 6,
    //   address: '0xdac17f958d2ee523a2206206994597c13d831ec7',
    //   logoURI: '/images/token/USDT.png',
    //   popular: true,
    // },
    // {
    //   name: 'USD Coin',
    //   symbol: 'USDC',
    //   decimals: 6,
    //   address: '0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48',
    //   logoURI: '/images/token/USDC.png',
    //   popular: true,
    // },
    // {
    //   name: 'Wrapped BTC',
    //   symbol: 'WBTC',
    //   decimals: 8,
    //   address: '0x2260fac5e5542a773aa44fbcfedf7c193bc2c599',
    //   logoURI: '/images/token/WBTC.png',
    //   popular: true,
    // },
    // {
    //   name: 'Dai Stablecoin',
    //   symbol: 'DAI',
    //   decimals: 18,
    //   address: '0x6b175474e89094c44da98b954eedeac495271d0f',
    //   logoURI: '/images/token/DAI.png',
    //   popular: true,
    // },
    // {
    //   name: 'Wrapped ETH',
    //   symbol: 'WETH',
    //   decimals: 18,
    //   address: '0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2',
    //   logoURI: '/images/token/WETH.png',
    //   isTop: true,
    // },
  ]
}