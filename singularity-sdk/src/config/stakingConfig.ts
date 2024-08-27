import { Token } from "../entities"
import { ChainId } from "./chain"

export type StakingConfig = {
  originalToken: Token,
  stakingToken: Token
}

export const stakingTokenConfig: { [chainId: number]: StakingConfig[] } = {
  [ChainId.MAINNET]: [
    {
      originalToken: {
        address: '0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE',
        decimals: 18,
        symbol: 'ETH',
        name: 'Ethereum',
      },
      stakingToken: {
        address: '0x1Df4fAe6CC88A19825dA7dCF8Fcac8E44BA14D2C',
        decimals: 18,
        symbol: 'sgETH',
        name: 'sgETH',
      },
    },
    {
      originalToken: {
        address: '0xae7ab96520de3a18e5e111b5eaab095312d7fe84',
        decimals: 18,
        symbol: 'stETH',
        name: 'Lido Staked Ether',
      },
      stakingToken: {
        address: '0xe397804A9Ff78329997A2b07aF91D484f78e77Be',
        decimals: 18,
        symbol: 'sgSTETH',
        name: 'sgSTETH',
      },
    },
    {
      originalToken: {
        address: '0xae78736cd615f374d3085123a210448e74fc6393',
        decimals: 18,
        symbol: 'rETH',
        name: 'Rocket Pool ETH',
      },
      stakingToken: {
        address: '0xA8B78eFF928c30e43A60d8920d1549177652045d',
        decimals: 18,
        symbol: 'sgRETH',
        name: 'sgRETH',
      },
    },
    {
      originalToken: {
        address: '0xdac17f958d2ee523a2206206994597c13d831ec7',
        decimals: 6,
        symbol: 'USDT',
        name: 'Tether USD',
      },
      stakingToken: {
        address: '0x91605474f1774f3C1401291A265fa8A995effeb2',
        decimals: 6,
        symbol: 'sgUSDT',
        name: 'sgUSDT',
      },
    },
    {
      originalToken: {
        address: '0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48',
        decimals: 6,
        symbol: 'USDC',
        name: 'USD Coin',
      },
      stakingToken: {
        address: '0x0692623f022a622b9CB33ffBEe6c14c8abebf4cc',
        decimals: 6,
        symbol: 'sgUSDC',
        name: 'sgUSDC',
      },
    },
  ],
  [ChainId.ARBITRUM_ONE]: [
    {
      originalToken: {
        address: '0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE',
        decimals: 18,
        symbol: 'ETH',
        name: 'Ethereum',
      },
      stakingToken: {
        address: '0xB2393C436a29edc40BA90b9944edB84466565E0c',
        decimals: 18,
        symbol: 'sgETH',
        name: 'sgETH',
      },
    },
    {
      originalToken: {
        address: '0xFd086bC7CD5C481DCC9C85ebE478A1C0b69FCbb9',
        decimals: 6,
        symbol: 'USDT',
        name: 'Tether USD',
      },
      stakingToken: {
        address: '0xAB5a3Ab2ef9a03de376CAce74c901a0fccD2A06d',
        decimals: 6,
        symbol: 'sgUSDT',
        name: 'sgUSDT',
      },
    },
    {
      originalToken: {
        address: '0xaf88d065e77c8cC2239327C5EDb3A432268e5831',
        decimals: 6,
        symbol: 'USDC',
        name: 'USD Coin',
      },
      stakingToken: {
        address: '0xFB6C93eF0B515d041b0DcDF427657E41DDDB8Da8',
        decimals: 6,
        symbol: 'sgUSDC',
        name: 'sgUSDC',
      },
    },
  ],
  [ChainId.BASE]: [],
  [ChainId.SEPOLIA]: [
    {
      originalToken: {
        address: '0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE',
        decimals: 18,
        symbol: 'ETH',
        name: 'Ethereum',
      },
      stakingToken: {
        address: '0x56fBD5d5C3e9D5f9Ae916F113232d52e6E377E71',
        decimals: 18,
        symbol: 'sgETH',
        name: 'sgETH',
      },
    },
  ],
  [ChainId.BounceBit]: [
    {
      originalToken: {
        address: '0x0000000000000000000000000000000000000000',
        decimals: 18,
        symbol: 'BB',
        name: 'BB',
      },
      stakingToken: {
        address: '0x5D873095152b921222241c0Cbd82d83b47bB31D3',
        decimals: 18,
        symbol: 'sgBB',
        name: 'sgBB',
      },
    },
    {
      originalToken: {
        address: '0xF5e11df1ebCf78b6b6D26E04FF19cD786a1e81dC',
        decimals: 18,
        symbol: 'BBTC',
        name: 'BBTC',
      },
      stakingToken: {
        address: '0x578A43b97a9c46b13B153Df6AA05393b78E241Ee',
        decimals: 18,
        symbol: 'sgBBTC',
        name: 'sgBBTC',
      },
    },
    {
      originalToken: {
        address: '0x77776b40C3d75cb07ce54dEA4b2Fd1D07F865222',
        decimals: 18,
        symbol: 'BBUSD',
        name: 'BBUSD',
      },
      stakingToken: {
        address: '0x9af2DDB1E3A30442f590f659e13a243Da15C86A0',
        decimals: 18,
        symbol: 'sgBBUSDC',
        name: 'sgBBUSDC',
      },
    },
    {
      originalToken: {
        address: '0x22aAC17E571D6651880d057e310703fF4C7c3483',
        decimals: 18,
        symbol: 'stBB',
        name: 'stBB',
      },
      stakingToken: {
        address: '0x3dD11E06DAA99AD255C83545d05Ad27602e0907F',
        decimals: 18,
        symbol: 'sgSTBB',
        name: 'sgSTBB',
      },
    },
  ],
  [ChainId.BounceBitTestnet]: [
    {
      originalToken: {
        address: '0x0000000000000000000000000000000000000000',
        decimals: 18,
        symbol: 'BB',
        name: 'BB',
      },
      stakingToken: {
        address: '0x1276801901cBC847077a8e7e27C973894c86157A',
        decimals: 18,
        symbol: 'sgBB',
        name: 'sgBB',
      },
    },
  ],
  [ChainId.HARDHAT]: [
    {
      originalToken: {
        address: '0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE',
        decimals: 18,
        symbol: 'ETH',
        name: 'Ethereum',
      },
      stakingToken: {
        address: '0x5fe2f174fe51474Cd198939C96e7dB65983EA307',
        decimals: 18,
        symbol: 'sgETH',
        name: 'sgETH',
      },
    },
    {
      originalToken: {
        address: '0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48',
        decimals: 6,
        symbol: 'USDC',
        name: 'USDC',
      },
      stakingToken: {
        address: '0x8AFB0C54bAE39A5e56b984DF1C4b5702b2abf205',
        decimals: 6,
        symbol: 'sgUSDC',
        name: 'sgUSDC',
      },
    },
  ],
}
