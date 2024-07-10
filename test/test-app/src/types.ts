import { BigNumber } from '@ethersproject/bignumber'
import { Note } from '@thesingularitynetwork/darkpool-v1-proof'
import { FeeAmount, Position } from '@uniswap/v3-sdk'
import { Hex } from 'viem'

export class DarkpoolError extends Error {
  constructor(message: string) {
    super(message)
    this.name = 'DarkpoolError'
    Object.setPrototypeOf(this, DarkpoolError.prototype)
  }
}

export type HexData = `0x${string}`

export type RelayerInfo = {
  relayerName: string
  relayerAddress: string
  hostUrl: string
}

export type Config = {
  chainId: number
  supportedChains: number[]
  rpcUrls: Record<number, string>
  oracleRpcUrls: Record<number, string>
}

export type ChainConfig = {
  chainId: number
  networkConfig: NetworkConfig
  rpcUrl: string
  oracleRpcUrl: string
  relayers: RelayerInfo[]
  tokens: TokenConfig[]
  topTokens: TokenConfig[]
  popularTokens: TokenConfig[]
}

export type NetworkConfig = {
  priceOracle: HexData
  ethAddress: HexData
  nativeWrapper: HexData
  complianceManager: HexData
  merkleTreeOperator: HexData
  darkpoolAssetManager: HexData
  drakpoolSubgraphUrl: string
  stakingOperator: HexData
  stakingAssetManager: HexData

  explorerUrl: {
    tx: string
    address: string
    block: string
  }
}


export type TokenConfig = {
  name: string
  symbol: string
  decimals: number
  address: string
  logoURI?: string
  popular?: boolean
  isTop?: boolean
}


export enum Action {
  WITHDRAW = 'WITHDRAW',
  UNISWAP_SINGLE_SWAP = 'UNISWAP_SINGLE_SWAP',
  UNISWAP_LP_DEPOSIT = 'UNISWAP_LP_DEPOSIT',
  UNISWAP_LP_WITHDRAW = 'UNISWAP_LP_WITHDRAW',
  UNISWAP_LP_COLLECT_FEE = 'UNISWAP_LP_COLLECT_FEE',
  CURVE_LP_DEPOSIT = 'CURVE_LP_DEPOSIT',
  CURVE_LP_WITHDRAW = 'CURVE_LP_WITHDRAW',
  CURVE_MULTI_SWAP = 'CURVE_MULTI_SWAP',
  STAKE = 'STAKE',
  REDEEM = 'REDEEM',
  ROCKETPOOL_STAKE = 'ROCKETPOOL+STAKE',
  ROCKETPOOL_UNSTAKE = 'ROCKETPOOL+UNSTAKE',
}

export enum NoteAction {
  DEPOSIT = 'DEPOSIT',
  WITHDRAW = 'WITHDRAW',
  JOIN = 'COMBINE',
  SPLIT = 'SPLIT',
  JOIN_SPLIT = 'COMBINE+SPLIT',
  RECEIVE = 'RECEIVE',
  UNISWAP_SWAP = 'UNI+SWAP',
  UNISWAP_LP_DEPOSIT = 'UNI+ADDLP',
  UNISWAP_LP_WITHDRAW = 'UNI+REMOVELP',
  UNISWAP_LP_COLLECT_FEE = 'UNI+FEE',
  CURVE_LP_DEPOSIT = 'CURVE+ADDLP',
  CURVE_LP_WITHDRAW = 'CURVE+REMOVELP',
  CURVE_MULTI_SWAP = 'CURVE+SWAP',
  STAKE = 'STAKE',
  REDEEM = 'REDEEM',
  ROCKETPOOL_STAKE = 'ROCKETPOOL+STAKE',
  ROCKETPOOL_UNSTAKE = 'ROCKETPOOL+UNSTAKE',
}

export enum NoteStatus {
  USED,
  VERFIED,
  INVALID,
  PENDING,
}

export type FeeType = {
  gasFeeInEth: bigint
  gasFeeInToken: bigint
  serviceFeeInEth: bigint
  serviceFeeInToken: bigint
  tokenDecimal: number
}

export type Fee = {
  gasFeeInEth: bigint
  gasFeeInToken: bigint
  serviceFeeInEth: bigint
  serviceFeeInToken: bigint
  token: TokenConfig
}

export type Fees = {
  totalGasFeeInEth: bigint
  fees: Fee[]
}

export type CurvePool = {
  symbol: string
  poolAddress: string
  underlyingTokens: TokenConfig[]
}

export enum ChainId {
  HARDHAT = 31337,
  HARDHAT_ARBITRUM = 31338,
  HARDHAT_POLYGON = 31339,
  MAINNET = 1,
  GOERLI = 5,
  SEPOLIA = 11155111,
  ARBITRUM_ONE = 42161,
  OPTIMISM = 10,
  POLYGON = 137,
  CELO = 42220,
  BNB = 56,
  AVALANCHE = 43114,
  BASE = 100,
  BounceBit = 6001,
  BounceBitTestnet = 6000,
}

export type UniswapPositionDetail = {
  position: Position
  fee0: BigNumber
  fee1: BigNumber
  token0: TokenConfig
  token1: TokenConfig
}

export type NoteWithToken = {
  note: Note
  token: TokenConfig
  secret?: string
}

export type TokenWithAmount = {
  token: TokenConfig
  amount: bigint
}

export type UniswapSwapEstimatedOut = {
  amountOut: bigint
  fee: Fee
  feeTier: FeeAmount
}

export type CurveSwapEstimatedOut = {
  amountOut: bigint
  fee: Fee
}

export type CurveAddLiquidityEstimatedOut = {
  amountOut: bigint
  fees: Fee[]
}

export type RocketPoolStakeEstimatedOut = {
  amountOut: bigint
  fee: Fee
}

export interface StakeStats {
  ethStakingTotal: number
  nodeOpsTotal: number
  timezonesTotal: number
  nodeCommission: string
}

export interface StakeData {
  stats: StakeStats
  rplTotalEffectiveStaked: string
  rethAPR: string
  validators: number
  ethStaked: string
  beaconChainAPR: string
  rplPrice: string
  ethPrice: string
  rplTotalSupply: string
  ethTotalSupply: string
  stakingMinipools: string
  rplPriceInEth: string
}

export enum ComplianceOnboardingType {
  SINGLE = 1,
  COMBO = 2,
}

export enum ComplianceOnboardingVendor {
  KEYRING = 1,
  ZKME = 2,
  QUADRATA = 3,
}
