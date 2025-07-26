import { AerodromeSwapRoute } from '@thesingularitynetwork/darkpool-v1-proof';

type BaseRelayerRequest = {
  proof: string;
  relayer: string;
  merkleRoot: string;
  verifierArgs: string[];
};

export type WithdrawRelayerRequest = BaseRelayerRequest & {
  asset: string;
  nullifier: string;
  recipient: string;
  amount: string;
  refund: string;
};

export type CurveAddLiquidityRelayerRequest = BaseRelayerRequest & {
  nullifiers: string[];
  assets: string[];
  amounts: string[];
  pool: string;
  poolType: string;
  basePoolType: number;
  lpToken: string;
  poolFlag: string;
  booleanFlag: boolean;
  minMintAmount: string;
  noteFooter: string;
  gasRefund: string[];
};

export type CurveRemoveLiquidityRelayerRequest = BaseRelayerRequest & {
  nullifier: string;
  asset: string;
  amount: string;
  amountBurn: string;
  pool: string;
  poolType: string;
  basePoolType: number;
  assetsOut: string[];
  minExpectedAmountsOut: string[];
  poolFlag: string;
  booleanFlag: boolean;
  noteFooters: string[];
  gasRefund: string[];
};

export type CurveMultiExchangeRelayerRequest = BaseRelayerRequest & {
  nullifier: string;
  assetIn: string;
  amountIn: string;
  routes: string[];
  swapParams: number[][];
  pools: string[];
  routeHash: string;
  assetOut: string;
  minExpectedAmountOut: string;
  noteFooterOut: string;
  gasRefund: string;
};

export type UniswapCollectFeesRelayerRequest = BaseRelayerRequest & {
  tokenId: string;
  feeNoteFooter1: string;
  feeNoteFooter2: string;
  relayerGasFeeFromToken1: string;
  relayerGasFeeFromToken2: string;
};

export type UniswapAddLiquidityRelayerRequest = BaseRelayerRequest & {
  asset1: string;
  amount1: string;
  nullifier1: string;
  asset2: string;
  amount2: string;
  nullifier2: string;
  refundToken1: string;
  refundToken2: string;
  changeNoteFooter1: string;
  changeNoteFooter2: string;
  tickMin: number;
  tickMax: number;
  deadline: string;
  outNoteFooter: string;
  feeTier: string;
  amountMin1: string;
  amountMin2: string;
};

export type UniswapRemoveLiquidityRelayerRequest = BaseRelayerRequest & {
  nftAddress: string;
  tokenId: string;
  nullifier: string;
  outNoteFooter1: string;
  outNoteFooter2: string;
  relayerGasFeeFromToken1: string;
  relayerGasFeeFromToken2: string;
  deadline: string;
  amount1Min: string;
  amount2Min: string;
};

export type UniswapSwapRelayerRequest = BaseRelayerRequest & {
  asset: string;
  amount: string;
  nullifier: string;
  assetOut: string;
  amountOutMin: string;
  noteFooterOut: string;
  refund: string;
  poolFee: string;
};

export type DefiInfraRelayerRequest = BaseRelayerRequest & {
  inNoteType: number;
  inNullifiers: string[];
  inAssets: string[];
  inAmountsOrNftIds: string[];
  contractAddress: string;
  defiParameters: string;
  defiParameterHash: string;
  outNoteType: number;
  outAssets: string[];
  outNoteFooters: string[];
  relayer: string;
  gasRefund: string[];
};

export type StakeNoteRelayerRequest = BaseRelayerRequest & {
  inAsset: string;
  inNullifier: string;
  outNoteFooter: string;
  inAmount: string;
  refund: string;
};

export type RedeemRelayerRequest = BaseRelayerRequest & {
  inNullifier: string;
  inAsset: string;
  inAmount: string;
  outNoteFooter: string;
  refund: string;
};

export type AerodromeSwapRelayerRequest = BaseRelayerRequest & {
  inNullifier: string;
  inAsset: string;
  inAmount: string;
  routes: AerodromeSwapRoute[];
  routeHash: string;
  minExpectedAmountOut: string;
  deadline: string;
  outNoteFooter: string;
  gasRefund: string;
};

export type AerodromeAddLiquidityRelayerRequest = BaseRelayerRequest & {
  inNullifier1: string;
  inNullifier2: string;
  inAsset1: string;
  inAsset2: string;
  inAmount1: string;
  inAmount2: string;
  pool: string;
  stable: boolean;
  amount1Min: string;
  amount2Min: string;
  deadline: string;
  outNoteFooter: string;
  outChangeFooter1: string;
  outChangeFooter2: string;
  refundToken1: string;
  refundToken2: string;
};

export type AerodromeRemoveLiquidityRelayerRequest = BaseRelayerRequest & {
  nullifier: string;
  pool: string;
  amount: string;
  amountBurn: string;
  stable: boolean;
  outAsset1: string;
  outAsset2: string;
  outAmount1Min: string;
  outAmount2Min: string;
  deadline: string;
  outNoteFooter1: string;
  outNoteFooter2: string;
  outChangeNoteFooter: string;
  refundToken1: string;
  refundToken2: string;
};

export type StakeRocketPoolRelayerRequest = BaseRelayerRequest & {
  nullifier: string;
  amount: string;
  noteFooterOut: string;
  refund: string;
};

export type UnstakeRocketPoolRelayerRequest = BaseRelayerRequest & {
  nullifier: string;
  amount: string;
  noteFooterOut: string;
  refund: string;
};

export type ClaimStreamSablierRelayerRequest = BaseRelayerRequest & {
  nullifier: string;
  stream: string;
  streamId: string;
  assetOut: string;
  amountOut: string;
  noteFooterOut: string;
  refund: string;
};

export type TheDeepNoteDepositRelayerRequest = BaseRelayerRequest & {
  asset1: string;
  amount1: string;
  asset2: string;
  amount2: string;
  inNullifier1: string;
  inNullifier2: string;
  noteFooter: string;
  nullifier: string;
  vaultAddress: string;
  volatility: string;
  refund1: string;
  refund2: string;
};


export type TheDeepWithdrawRelayerRequest = BaseRelayerRequest & {
  nullifier: string;
  vaultAddress: string;
  amount: string;
  receipt: string;
  refund1: string;
  refund2: string;
};