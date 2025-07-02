// import curve from '@curvefi/api'
// import { ethers } from 'ethers'
// import { CURVE_POOL, CurvePoolConfig, POOL_TYPE } from '../../config/curveConfig'
// import { Token } from '../../entities/token'
// import { darkPool } from '../../darkpool'
// import { DarkpoolError } from '../../entities'
// // import { PoolTemplate } from '@curvefi/api/lib/pools'

// export async function initCurve(rpcUrl: string, chainId: number) {
//     await curve.init(
//         'JsonRpc',
//         { url: rpcUrl },
//         { chainId: chainId },
//     )
//     await Promise.allSettled([
//         curve.factory.fetchPools(true),
//         curve.cryptoFactory.fetchPools(true),
//         curve.crvUSDFactory.fetchPools(true),
//         curve.tricryptoFactory.fetchPools(true),
//         curve.stableNgFactory.fetchPools(true),
//     ])
//     await Promise.allSettled([
//         curve.factory.fetchNewPools(),
//         curve.cryptoFactory.fetchNewPools(),
//         curve.tricryptoFactory.fetchNewPools(),
//         curve.stableNgFactory.fetchNewPools(),
//     ])
// }

// export function getBooleanFlag(pool: CurvePoolConfig, isWrapped: boolean) {
//     const poolType = getPoolType(pool, isWrapped)
//     if (poolType == POOL_TYPE.META || poolType == POOL_TYPE.FSN) {
//         return false
//     } else {
//         return !isWrapped
//     }
// }

// export function getPoolFlag(pool: CurvePoolConfig, isWrapped: boolean) {
//     const poolType = getPoolType(pool, isWrapped)
//     if (poolType == POOL_TYPE.META) {
//         return pool.basePoolType || 0
//     }
//     else if (poolType == POOL_TYPE.FSN) {
//         return 0
//     } else {
//         const plainFlag = isPlainPool(pool) ? 0b100000 : 0
//         const isLegacy = pool.isLegacy || 0
//         return plainFlag | isLegacy
//     }
// }

// export function getPoolType(pool: CurvePoolConfig, isWrapped: boolean) {
//     let poolType = pool.poolType || POOL_TYPE.NORMAL

//     if (poolType == POOL_TYPE.META && isWrapped) {
//         poolType = POOL_TYPE.NORMAL
//     }
//     return poolType
// }

// // export async function getWithdrawEstimateForAll(
// //     pool: CurvePoolConfig,
// //     lpTokenAmount: number,
// //     isWrapped: boolean,
// // ) {
// //     const curvePool:PoolTemplate = curve.getPool(pool.id)
// //     if (curvePool) {
// //         console.log(curvePool)
// //         const estimated = isWrapped
// //             ? await curvePool?.withdrawWrappedExpected(lpTokenAmount)
// //             : await curvePool?.withdrawExpected(lpTokenAmount)

// //         console.log(estimated)

// //         let estimatedBigInt: bigint[] = []
// //         if (isWrapped) {
// //             pool.wrappedDecimals.forEach((decimals, i) => {
// //                 estimatedBigInt.push(
// //                     ethers.parseUnits(estimated[i], decimals),
// //                 )
// //             })
// //         } else {
// //             pool.underlyingDecimals.forEach((decimals, i) => {
// //                 estimatedBigInt.push(
// //                     ethers.parseUnits(estimated[i], decimals),
// //                 )
// //             })
// //         }

// //         return estimatedBigInt
// //     } else {
// //         throw new Error('Pool not found ' + pool.name)
// //     }
// // }

// // export async function getWithdrawEstimateForOneCoin(
// //     pool: CurvePoolConfig,
// //     lpTokenAmount: number,
// //     isWrapped: boolean,
// //     coinIndex: number,
// // ) {
// //     const curvePool = curve.getPool(pool.id)
// //     if (curvePool) {
// //         const estimated = isWrapped
// //             ? await curvePool.withdrawOneCoinWrappedExpected(lpTokenAmount, coinIndex)
// //             : await curvePool.withdrawOneCoinExpected(lpTokenAmount, coinIndex)

// //         if (isWrapped) {
// //             return ethers.parseUnits(estimated, pool.underlyingDecimals[coinIndex])
// //         } else {
// //             return ethers.parseUnits(estimated, pool.wrappedDecimals[coinIndex])
// //         }
// //     } else {
// //         throw new Error('Pool not found ' + pool.name)
// //     }
// // }

// export function isPlainPool(pool: CurvePoolConfig) {
//     return pool.isPlain
// }

// export function getCurvePoolData(lpToken: string): CurvePoolConfig | undefined {
//     if (CURVE_POOL[darkPool.chainId] === undefined) {
//         throw new DarkpoolError('No curve pool configuration found for this chainId')
//     }
//     const pool = CURVE_POOL[darkPool.chainId].find(
//         (pool) => pool.lpToken.toLowerCase() === lpToken.toLowerCase(),
//     )
//     return pool
// }

// export async function getMultiExchangeOutputAndArgs(
//     inAmount: bigint,
//     inAsset: Token,
//     outAsset: Token,
// ) {
//     const { route, output } = await curve.router.getBestRouteAndOutput(
//         inAsset.address,
//         outAsset.address,
//         ethers.formatUnits(inAmount, inAsset.decimals),
//     )
//     if (!route || route.length <= 0) {
//         throw new DarkpoolError('Swap is not available for this token pair')
//     }
//     const args = curve.router.getArgs(route)
//     console.log('==============>', route, args)
//     const parsedOutput = ethers.parseUnits(
//         output.toString(),
//         outAsset.decimals,
//     )
//     return { output, parsedOutput, args }
// }

// // export async function getAddLiquidityExpectedOutput(
// //     poolId: string,
// //     coinAmounts: number[],
// //     isWrapped: boolean
// // ) {
// //     const pool = curve.getPool(poolId)
// //     if (isWrapped) {
// //         return await pool.depositWrappedExpected(coinAmounts)
// //     } else {
// //         return await pool.depositExpected(coinAmounts)
// //     }
// // }

// // export async function getRemoveLiquidityExpectedOutput(
// //     poolAddress: string,
// //     lpTokenAmounts: number,
// // ) {
// //     const pool = curve.getPool(poolAddress)
// //     return await pool.withdrawExpected(lpTokenAmounts)
// // }
