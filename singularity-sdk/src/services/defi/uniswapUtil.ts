// import { Price, Token } from '@uniswap/sdk-core'
// import IUniswapV3PoolABI from '@uniswap/v3-core/artifacts/contracts/interfaces/IUniswapV3Pool.sol/IUniswapV3Pool.json'
// import INfpManager from '@uniswap/v3-periphery/artifacts/contracts/NonfungiblePositionManager.sol/NonfungiblePositionManager.json'
// import IQuoterV2 from '@uniswap/v3-periphery/artifacts/contracts/interfaces/IQuoterV2.sol/IQuoterV2.json'
// import {
//     FeeAmount,
//     Pool,
//     Position,
//     computePoolAddress,
//     nearestUsableTick,
//     priceToClosestTick,
//     tickToPrice
// } from '@uniswap/v3-sdk'
// import { BigNumber, ethers } from 'ethers'
// import { Abi } from 'viem'
// import { isAddressEquals, isNativeCurrency, isNativeWrappedCurrency, isNotNativeCurrency } from '../../helpers/utils'
// import { DarkpoolError, HexData, NoteWithToken, TokenConfig, UniswapPositionDetail } from '../../types'
// import { darkPool } from '../../darkpool'

// const MAX_UINT128 = BigNumber.from(2).pow(128).sub(1)

// function getPoolAddress(token1: Token, token2: Token, feeTier: FeeAmount) {
//     return computePoolAddress({
//         factoryAddress: uniswapConfig[config.chainId].factoryAddress,
//         tokenA: token1,
//         tokenB: token2,
//         fee: feeTier,
//     }) as HexData
// }

// export async function getLiquidityOfPools(poolAddress: HexData[]) {
//     const results = await readContracts(wagmiConfig, {
//         contracts: [
//             {
//                 abi: IUniswapV3PoolABI.abi as Abi,
//                 address: poolAddress[0],
//                 functionName: 'liquidity',
//                 args: [],
//             },
//             {
//                 abi: IUniswapV3PoolABI.abi as Abi,
//                 address: poolAddress[1],
//                 functionName: 'liquidity',
//                 args: [],
//             },
//             {
//                 abi: IUniswapV3PoolABI.abi as Abi,
//                 address: poolAddress[2],
//                 functionName: 'liquidity',
//                 args: [],
//             },
//             {
//                 abi: IUniswapV3PoolABI.abi as Abi,
//                 address: poolAddress[3],
//                 functionName: 'liquidity',
//                 args: [],
//             },
//         ],
//     })

//     return results.map((result) => {
//         if (result.status === 'success') {
//             return result.result as bigint
//         } else {
//             return undefined
//         }
//     })
// }

// export async function getPoolInfo(
//     token1: Token,
//     token2: Token,
//     feeTier: FeeAmount,
// ) {
//     if (isAddressEquals(token1.address, token2.address) ||
//         (isNativeCurrency(token1.address) && isNativeWrappedCurrency(token2.address)) ||
//         (isNativeCurrency(token2.address) && isNativeWrappedCurrency(token1.address))) {
//         throw new DarkpoolError('Invalid token pair')
//     }

//     const currentPoolAddress = getPoolAddress(token1, token2, feeTier)
//     const results = await readContracts(wagmiConfig, {
//         contracts: [
//             {
//                 address: currentPoolAddress,
//                 abi: IUniswapV3PoolABI.abi as Abi,
//                 functionName: 'slot0',
//                 args: [],
//             },
//             {
//                 abi: IUniswapV3PoolABI.abi as Abi,
//                 address: currentPoolAddress,
//                 functionName: 'tickSpacing',
//                 args: [],
//             },
//             {
//                 abi: IUniswapV3PoolABI.abi as Abi,
//                 address: currentPoolAddress,
//                 functionName: 'liquidity',
//                 args: [],
//             },
//         ],
//     })

//     if (results[0].result == undefined) {
//         throw new DarkpoolError('Could not find pool with this token pair')
//     }

//     const slot = results[0].result as any[]
//     const tickSpacing = results[1].result as number
//     const liquidity = results[2].result as bigint

//     return {
//         pool: new Pool(
//             token1,
//             token2,
//             feeTier,
//             slot[0].toString(),
//             liquidity.toString(),
//             slot[1],
//         ),
//         tickSpacing,
//     }
// }

// export function token2AmountFromTick(
//     token1: Token,
//     token2: Token,
//     tickLow: number,
//     tickHigh: number,
//     token1Amount: number,
// ) {
//     const tickSpacing = 10
//     const tick = (tickLow + tickHigh) / 2
//     const price = tickToPrice(token1, token2, tick)
//     return price.toFixed(token2.decimals)
// }

// export async function findBestFeeTier(token1: TokenConfig, token2: TokenConfig) {
//     const feeTiers = [FeeAmount.LOWEST, FeeAmount.LOW, FeeAmount.MEDIUM, FeeAmount.HIGH];
//     const token1Obj = tokenConfigToToken(token1);
//     const token2Obj = tokenConfigToToken(token2);

//     let poolAddress: HexData[] = [];
//     for (const feeTier of feeTiers) {
//         poolAddress.push(getPoolAddress(token1Obj, token2Obj, feeTier));
//     }

//     console.log(poolAddress);

//     const liquidity = await getLiquidityOfPools(poolAddress);
//     if (!liquidity || liquidity.length != 4) {
//         throw new DarkpoolError('Could not find pool with this token pair');
//     }

//     let bestFeeTier = undefined;
//     let maxLiquidity = BigInt(0);
//     for (let i = 0; i < liquidity.length; i++) {
//         const tmpLiquidity = liquidity[i];
//         if (tmpLiquidity != undefined && tmpLiquidity > maxLiquidity) {
//             maxLiquidity = tmpLiquidity;
//             bestFeeTier = feeTiers[i];
//         }
//     }

//     if (!bestFeeTier) {
//         if (isNotNativeCurrency(token1.address) && isNotNativeCurrency(token2.address)) {
//         }

//         throw new DarkpoolError('Could not find pool with this token pair');
//     }
//     return bestFeeTier
// }

// export function refinePrice(
//     token1: Token,
//     token2: Token,
//     tickSpacing: number,
//     originPrice: number,
// ) {
//     const tick = getTickFromPrice(token1, token2, tickSpacing, originPrice)
//     const price = tickToPrice(token1, token2, tick)
//     return price.toFixed(token2.decimals)
// }

// export function getTickFromPrice(
//     token1: Token,
//     token2: Token,
//     tickSpacing: number,
//     price: number,
// ) {
//     let priceObj: Price<Token, Token> = new Price(
//         token1,
//         token2,
//         10 ** token1.decimals,
//         Math.floor(price * 10 ** token2.decimals),
//     )
//     if (!token1.sortsBefore(token2)) {
//         priceObj = priceObj.invert()
//     }
//     return nearestUsableTick(priceToClosestTick(priceObj), tickSpacing)
// }

// export async function getTickSpacing(
//     token1: Token,
//     token2: Token,
//     feeTier: FeeAmount,
// ) {
//     return (await readContract(wagmiConfig, {
//         abi: IUniswapV3PoolABI.abi,
//         address: getPoolAddress(token1, token2, feeTier),
//         functionName: 'tickSpacing',
//         args: [],
//     })) as number
// }

// export async function getPairStatus(tokenIn: string, tokenOut: string) {
//     let tmpTokenIn = tokenIn
//     let tmpTokenOut = tokenOut
//     if (!isNotNativeCurrency(tokenIn)) {
//         tmpTokenIn = uniswapConfig[config.chainId].wrappedNativeTokenAddress
//     } else if (!isNotNativeCurrency(tokenOut)) {
//         tmpTokenOut = uniswapConfig[config.chainId].wrappedNativeTokenAddress
//     }

//     //TODO calling uniswap subgraph

//     return true
// }

// export async function getTicks(tokenIn: string, tokenOut: string) {
//     let tmpTokenIn = tokenIn
//     let tmpTokenOut = tokenOut
//     if (!isNotNativeCurrency(tokenIn)) {
//         tmpTokenIn = uniswapConfig[config.chainId].wrappedNativeTokenAddress
//     } else if (!isNotNativeCurrency(tokenOut)) {
//         tmpTokenOut = uniswapConfig[config.chainId].wrappedNativeTokenAddress
//     }

//     //TODO calling uniswap subgraph
// }

// export async function quote(inAsset: TokenConfig, inAmount: bigint, outAsset: TokenConfig, feeTier: FeeAmount) {
//     let tmpTokenIn = inAsset.address
//     let tmpTokenOut = outAsset.address
//     if (!isNotNativeCurrency(tmpTokenIn)) {
//         tmpTokenIn = uniswapConfig[config.chainId].wrappedNativeTokenAddress
//     }
//     if (!isNotNativeCurrency(tmpTokenOut)) {
//         tmpTokenOut = uniswapConfig[config.chainId].wrappedNativeTokenAddress
//     }

//     const result = await readContract(wagmiConfig, {
//         address: uniswapConfig[config.chainId].quoterContractAddress,
//         abi: IQuoterV2.abi,
//         functionName: 'quoteExactInputSingle',
//         args: [
//             {
//                 tokenIn: tmpTokenIn,
//                 tokenOut: tmpTokenOut,
//                 amountIn: inAmount,
//                 fee: feeTier,
//                 sqrtPriceLimitX96: 0,
//             },
//         ],
//     })
//     return result as [
//         amountOut: bigint,
//         sqrtPriceX96After: bigint,
//         initializedTicksCrossed: bigint,
//         gasEstimate: bigint,
//     ]
// }

// export function getPosNftAddress() {
//     return darkPool.contracts.uniswapConfig.v3PosNftAddress;
// }

// async function unwrapWEHNeeded(token: Token) {
//     if (isAddressEquals(token.address, darkPool.contracts.uniswapConfig.wrappedNativeTokenAddress)) {
//         return new Token(
//             token.chainId,
//             darkPool.contracts.ethAddress,
//             token.decimals,
//         );
//     }

//     return token
// }

// export async function getPosition(
//     tokenId: bigint,
// ): Promise<UniswapPositionDetail> {
//     const nfpManagerContract = new ethers.Contract(
//         getPosNftAddress(),
//         INfpManager.abi,
//         darkPool.provider,
//     )
//     const result = await nfpManagerContract.positions(tokenId)

//     const token0 = await getTokenConfig(result.token0)
//     const token1 = await getTokenConfig(result.token1)
//     const token0Obj = tokenConfigToToken(token0)
//     const token1Obj = tokenConfigToToken(token1)
//     const { pool } = await getPoolInfo(token0Obj, token1Obj, result.fee)
//     const position = new Position({
//         pool,
//         liquidity: result.liquidity.toString(),
//         tickLower: result.tickLower,
//         tickUpper: result.tickUpper,
//     })

//     const [fee0, fee1] = await getUnclaimedFees(tokenId);

//     return {
//         position,
//         fee0,
//         fee1,
//         token0: await unwrapWEHNeeded(token0),
//         token1: await unwrapWEHNeeded(token1),
//     }
// }

// export async function getUnclaimedFees(tokenId: bigint) {
//     const nfpManagerContract = new ethers.Contract(
//         getPosNftAddress(),
//         INfpManager.abi,
//         darkPool.provider,
//     )

//     const owner = await nfpManagerContract.ownerOf(tokenId);

//     const result = await nfpManagerContract.callStatic.collect(
//         {
//             tokenId: ethers.toBeHex(tokenId),
//             recipient: owner,
//             amount0Max: MAX_UINT128,
//             amount1Max: MAX_UINT128,
//         },
//         { from: owner }
//     )
//     return result as [amount0: BigNumber, amount1: BigNumber]
// }

// export function estimateAnotherAmount(pool: Pool, tickLower: number, tickUpper: number, token: TokenConfig, amount: bigint) {
//     if (pool.token0.address == token.address) {
//         const position = Position.fromAmount0({
//             pool,
//             tickLower: tickLower > tickUpper ? tickUpper : tickLower,
//             tickUpper: tickUpper > tickLower ? tickUpper : tickLower,
//             amount0: amount.toString(),
//             useFullPrecision: true
//         });

//         return position.amount1.toSignificant();

//     } else {
//         const position = Position.fromAmount1({
//             pool,
//             tickLower: tickLower > tickUpper ? tickUpper : tickLower,
//             tickUpper: tickUpper > tickLower ? tickUpper : tickLower,
//             amount1: amount.toString(),
//         });

//         return position.amount0.toSignificant();
//     }
// }

// export function estimatePosition(pool: Pool,
//     tickLower: number,
//     tickUpper: number,
//     inNote1: NoteWithToken,
//     inNote2: NoteWithToken) {
//     const amount0 = isAddressEquals(pool.token0.address, inNote1.token.address) ? inNote1.note.amount : inNote2.note.amount;
//     const amount1 = isAddressEquals(pool.token0.address, inNote1.token.address) ? inNote2.note.amount : inNote1.note.amount;

//     const position = Position.fromAmounts({
//         pool,
//         tickLower: tickLower < tickUpper ? tickLower : tickUpper,
//         tickUpper: tickLower < tickUpper ? tickUpper : tickLower,
//         amount0: amount0.toString(),
//         amount1: amount1.toString(),
//         useFullPrecision: true
//     });

//     return position;
// }
