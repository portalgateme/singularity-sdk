import { EMPTY_NOTE, Note, NoteType } from "@thesingularitynetwork/darkpool-v1-proof"
import { DefiInfraRequest, DefiInfraService, DepositService, OTCSwapDepositService, Order, WithdrawService, darkPool, isAddressCompliant } from "@thesingularitynetwork/singularity-sdk"
import { AbiCoder, solidityPacked } from "ethers"
import { useAccount } from "wagmi"
import { config } from "../constants"
import { networkConfig } from "../constants/networkConfig"
import { useToast } from "../contexts/ToastContext/hooks"
import { DarkpoolError, HexData, TokenConfig } from "../types"
import { useEthersSigner, wagmiConfig } from "../wagmi"
import { useSignMessage } from "./useSignMessage"
import { waitForTransactionReceipt } from '@wagmi/core'
import { useState } from "react"

export const useMakerDeposit = () => {

    const chainId = config.chainId
    const { address, isConnected } = useAccount()
    const signer = useEthersSigner()
    const { showPendingToast, showSuccessToast, closeToast, updatePendingToast } = useToast()
    const { signMessageAsync } = useSignMessage()
    const [partialSwapSecret, setPartialSwapSecret] = useState<string>('')

    const execute = async (makerAsset: TokenConfig, makerAmount: bigint, takerAsset: TokenConfig, takerAmount: bigint, orderId: string) => {
        if (!isConnected || !address || !chainId || !signer) {
            throw new DarkpoolError('Not connected')
        }

        showPendingToast(undefined, 'Signing Message')
        const signature = await signMessageAsync(address)

        darkPool.init(signer, chainId, [
            {
                relayerName: '',
                relayerAddress: '0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266',
                hostUrl: 'https://app.dev.portalgate.me:18000',
            }
        ], {
            priceOracle: config.networkConfig.priceOracle,
            ethAddress: config.networkConfig.ethAddress,
            nativeWrapper: config.networkConfig.nativeWrapper,
            complianceManager: config.networkConfig.complianceManager,
            merkleTreeOperator: config.networkConfig.merkleTreeOperator,
            darkpoolAssetManager: config.networkConfig.darkpoolAssetManager,
            stakingAssetManager: config.networkConfig.stakingAssetManager,
            stakingOperator: config.networkConfig.stakingOperator,
            otcSwapAssetManager: config.networkConfig.otcSwapAssetManager,
            drakpoolSubgraphUrl: ''
        })

        const isCompliant = await isAddressCompliant(address)
        if (!isCompliant) {
            throw new DarkpoolError('Address is not compliant')
        }

        const order:Order = {
            orderId: orderId,
            makerAsset: makerAsset.address,
            makerAmount: makerAmount,
            takerAsset: takerAsset.address,
            takerAmount: takerAmount,
        }

        const otcSwapDepositService = new OTCSwapDepositService()
        const { partialSwapSecret,context } = await otcSwapDepositService.prepareMakerAsset(order, address, signature)
        setPartialSwapSecret(partialSwapSecret)
        
        updatePendingToast(undefined, "Generating Proof & Depositing")
        const txId = await otcSwapDepositService.depositMakerAsset(context);
    }

    return {
        execute,
        partialSwapSecret
    }
}