import ISwapRouterAbi from '@uniswap/v3-periphery/artifacts/contracts/interfaces/ISwapRouter.sol/ISwapRouter.json'
import { writeContract } from '@wagmi/core'
import WETH9 from '../abis/WETH9.json'
import { wagmiConfig } from '../wagmi'


export async function getSomeWETH() {
  try {
    await writeContract(wagmiConfig, {
      abi: WETH9,
      address: '0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2',
      functionName: 'deposit',
      args: [],
      value: BigInt(100 * 1e18),
    })

  } catch (e: any) {
    console.log(e)
  }
}


export async function getSomeCoin(
  wethAmount: bigint,
  outAsset: string,
  address: string,
) {
  try {
    await writeContract(wagmiConfig, {
      abi: WETH9,
      address: '0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2',
      functionName: 'approve',
      args: [
        '0xE592427A0AEce92De3Edee1F18E0157C05861564',
        BigInt(99999999 * 1e18),
      ],
    })

    await writeContract(wagmiConfig, {
      abi: ISwapRouterAbi.abi,
      address: '0xE592427A0AEce92De3Edee1F18E0157C05861564',
      functionName: 'exactInputSingle',
      args: [
        {
          tokenIn: '0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2',
          tokenOut: outAsset,
          fee: 3000,
          recipient: address,
          deadline: Math.floor(Date.now() / 1000) + 60 * 2,
          amountIn: wethAmount,
          amountOutMinimum: 0,
          sqrtPriceLimitX96: 0,
        },
      ],
    })
  } catch (e: any) {
    console.log(e)
  }
}
