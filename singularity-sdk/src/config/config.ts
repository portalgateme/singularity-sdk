import { ChainId } from "./chain"

export enum Action {
    CURVE_LP_DEPOSIT = 'CURVE_LP_DEPOSIT',
    CURVE_LP_WITHDRAW = 'CURVE_LP_WITHDRAW',
    CURVE_MULTI_SWAP = 'CURVE_MULTI_SWAP',
    DEFI_INFRA = 'DEFI_INFRA',
    STAKE = 'STAKE',
    REDEEM = 'REDEEM',
    UNISWAP_SINGLE_SWAP = 'UNISWAP_SINGLE_SWAP',
    UNISWAP_LP_DEPOSIT = 'UNISWAP_LP_DEPOSIT',
    UNISWAP_LP_WITHDRAW = 'UNISWAP_LP_WITHDRAW',
    UNISWAP_LP_COLLECT_FEE = 'UNISWAP_LP_COLLECT_FEE',
    WITHDRAW = 'WITHDRAW',
    AERODROME_SWAP = 'AERODROME_SWAP',
    AERODROME_LP_DEPOSIT = 'AERODROME_LP_DEPOSIT',
    AERODROME_LP_WITHDRAW = 'AERODROME_LP_WITHDRAW',
}


export const relayerPathConfig: { [action: string]: string } = {
    [Action.WITHDRAW]: '/v1/pgDarkPoolWithdraw',
    [Action.UNISWAP_SINGLE_SWAP]: '/v1/pgDarkPoolUniswapSingleSwap',
    [Action.UNISWAP_LP_DEPOSIT]: '/v1/pgDarkPoolUniswapLP',
    [Action.UNISWAP_LP_WITHDRAW]: '/v1/pgDarkPoolUniswapRemoveLiquidity',
    [Action.UNISWAP_LP_COLLECT_FEE]: '/v1/pgDarkPoolUniswapCollectFees',
    [Action.CURVE_LP_DEPOSIT]: '/v1/pgDarkPoolCurveAddLiquidity',
    [Action.CURVE_LP_WITHDRAW]: '/v1/pgDarkPoolCurveRemoveLiquidity',
    [Action.CURVE_MULTI_SWAP]: '/v1/pgDarkPoolCurveMultiExchange',
    [Action.DEFI_INFRA]: '/v1/pgDarkPoolDefiInfra',
    [Action.STAKE]: '/v1/pgDarkPoolZkStake',
    [Action.REDEEM]: '/v1/pgDarkPoolZkRedeem',
    [Action.AERODROME_SWAP]: '/v1/pgDarkPoolAerodromeSwap',
    [Action.AERODROME_LP_DEPOSIT]: '/v1/pgDarkPoolAerodromeAddLiquidity',
    [Action.AERODROME_LP_WITHDRAW]: '/v1/pgDarkPoolAerodromeRemoveLiquidity',
}


export const legacyTokenConfig: { [chainId: number]: string[] } = {
    [ChainId.MAINNET]: ['0xdac17f958d2ee523a2206206994597c13d831ec7'],
    [ChainId.HARDHAT]: ["0xdac17f958d2ee523a2206206994597c13d831ec7"],
}