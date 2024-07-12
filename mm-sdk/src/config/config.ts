
export enum Action {
    WITHDRAW = 'WITHDRAW',
    UNISWAP_SINGLE_SWAP = 'UNISWAP_SINGLE_SWAP',
    UNISWAP_LP_DEPOSIT = 'UNISWAP_LP_DEPOSIT',
    UNISWAP_LP_WITHDRAW = 'UNISWAP_LP_WITHDRAW',
    UNISWAP_LP_COLLECT_FEE = 'UNISWAP_LP_COLLECT_FEE',
    CURVE_LP_DEPOSIT = 'CURVE_LP_DEPOSIT',
    CURVE_LP_WITHDRAW = 'CURVE_LP_WITHDRAW',
    CURVE_MULTI_SWAP = 'CURVE_MULTI_SWAP',
    DEFI_INFRA = 'DEFI_INFRA',
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
}

