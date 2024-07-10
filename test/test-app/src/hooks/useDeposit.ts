import { DepositService, darkPool } from "@thesingularitynetwork/mm-sdk"
import { useAccount } from "wagmi"
import { config } from "../constants"
import { useEthersProvider, useEthersSigner } from "../wagmi"
import { TokenConfig } from "../types"
import { useToast } from "../contexts/ToastContext/hooks"

export const useDeposit = () => {

    const chainId = config.chainId
    const { address } = useAccount()
    const signer = useEthersSigner()
    const { showPendingToast, showSuccessToast, closeToast, updatePendingToast } = useToast()


    const execute = async (asset: TokenConfig, amount: bigint, signature: string) => {
        if (signer && chainId && address) {
            darkPool.init(signer, chainId, [], {
                priceOracle: config.networkConfig.priceOracle,
                ethAddress: config.networkConfig.ethAddress,
                nativeWrapper: config.networkConfig.nativeWrapper,
                complianceManager: config.networkConfig.complianceManager,
                merkleTreeOperator: config.networkConfig.merkleTreeOperator,
                darkpoolAssetManager: config.networkConfig.darkpoolAssetManager,
                drakpoolSubgraphUrl: 'http://localhost:8000/subgraphs/name/singularity/',
                uniswapConfig: {
                    swapRouterAddress: '0x68b3465833fb72A70ecDF485E0e4C7bD8665Fc45',
                    quoterContractAddress: '0x61fFE014bA17989E743c5F6cB21bF9697530B21e',
                    wrappedNativeTokenAddress: '0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2',
                    v3PosNftAddress: '0xC36442b4a4522E871399CD717aBDD847Ab11FE88',
                    factoryAddress: '0x1F98431c8aD98523631AE4a59f267346ea31F984',
                    subgraphUrl: 'https://api.thegraph.com/subgraphs/name/uniswap/uniswap-v3?source=uniswap'
                },
            })


            const depositService = new DepositService()
            const { context, outNotes } = await depositService.prepare({
                symbol: asset.symbol,
                name: asset.name,
                decimals: asset.decimals,
                address: asset.address,
            }, amount, address, signature)

            showPendingToast(undefined, "Generating Proof")
            await depositService.generateProof(context)

            updatePendingToast(undefined, "Calling contract")
            const txId = await depositService.execute(context)

            showSuccessToast(txId)
            console.log(txId)
            console.log(outNotes)
        }

    }

    return {
        execute
    }
}