import { DarkPool, OTCSwapService, Order, WithdrawService, darkPool, isAddressCompliant } from "@thesingularitynetwork/singularity-sdk"
import { useAccount } from "wagmi"
import { config } from "../constants"
import { useToast } from "../contexts/ToastContext/hooks"
import { DarkpoolError, TokenConfig } from "../types"
import { useEthersSigner } from "../wagmi"
import { useSignMessage } from "./useSignMessage"

export const useMakerSwap = () => {

    const chainId = config.chainId
    const { address, isConnected } = useAccount()
    const signer = useEthersSigner()
    const { showPendingToast, showSuccessToast, closeToast, updatePendingToast } = useToast()
    const { signMessageAsync } = useSignMessage()

    const execute = async (makerAsset: TokenConfig, makerAmount: bigint, takerAsset: TokenConfig, takerAmount: bigint, orderId: string, fullSwapSecret: string) => {
        if (!isConnected || !address || !chainId || !fullSwapSecret || !signer) {
            throw new DarkpoolError('Not connected')
        }

        showPendingToast(undefined, 'Signing Message')
        const signedMessage = await signMessageAsync(address)

        const darkPool = new DarkPool();
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
            batchJoinSplitAssetManager: config.networkConfig.batchJoinSplitAssetManager,
            darkpoolSwapAssetManager: config.networkConfig.darkpoolSwapAssetManager,
            drakpoolSubgraphUrl: ''
        })

        const isCompliant = await isAddressCompliant(address, darkPool)
        if (!isCompliant) {
            throw new DarkpoolError('Address is not compliant')
        }

        const order: Order = {
            orderId: orderId,
            makerAsset: makerAsset.address,
            makerAmount: makerAmount,
            takerAsset: takerAsset.address,
            takerAmount: takerAmount,
        }

        const otcSwapService = new OTCSwapService(darkPool)
        const { context } = await otcSwapService.prepare(order, fullSwapSecret, signedMessage);

        updatePendingToast(undefined, "Generating Proof & Depositing")
        await otcSwapService.generateProof(context);
        const txId = await otcSwapService.execute(context);


        updatePendingToast(undefined, "Swap done, withdrawing")
        const makerNewNote = await otcSwapService.getMakerNewNoteAfterSwap(fullSwapSecret)

        const withdrawService = new WithdrawService(darkPool)
        const { context: withdrawContext } = await withdrawService.prepare(makerNewNote, address, signedMessage)
        await withdrawService.generateProof(withdrawContext)
        await withdrawService.executeAndWaitForResult(withdrawContext)
    }

    return {
        execute,
    }
}