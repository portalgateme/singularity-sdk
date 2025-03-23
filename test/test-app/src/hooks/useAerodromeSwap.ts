import { AerodromeSwapService, DarkPool, DepositService, isAddressCompliant } from "@thesingularitynetwork/singularity-sdk"
import { waitForTransactionReceipt } from '@wagmi/core'
import { ethers } from "ethers"
import { useAccount } from "wagmi"
import WETH9 from '../abis/WETH9.json'
import { config } from "../constants"
import { useToast } from "../contexts/ToastContext/hooks"
import { DarkpoolError, HexData } from "../types"
import { useEthersSigner, wagmiConfig } from "../wagmi"
import { useSignMessage } from "./useSignMessage"


const DEADLINE = 1000 * 60 * 10;
const PROOF_TIME = 1000 * 60 * 2;

export const useAerodromeSwap = () => {

    const chainId = config.chainId
    const { address, isConnected } = useAccount()
    const signer = useEthersSigner()
    const { showPendingToast, showSuccessToast, closeToast, updatePendingToast } = useToast()
    const { signMessageAsync } = useSignMessage()

    const wrapEth = async (wethAddress: string, amount: bigint) => {
        if (!isConnected || !address || !chainId || !signer) {
            throw new DarkpoolError('Not connected')
        }

        const wethContract = new ethers.Contract(wethAddress, WETH9, signer)
        const tx = await wethContract.deposit({ value: amount })
        await tx.wait()
    }

    const execute = async () => {
        if (!isConnected || !address || !chainId || !signer) {
            throw new DarkpoolError('Not connected')
        }

        showPendingToast(undefined, 'Signing Message')
        const signedMessage = await signMessageAsync(address)

        const darkPool = new DarkPool(signer, chainId, [
            {
                relayerName: '',
                relayerAddress: '0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266',
                hostUrl: 'https://app.dev.portalgate.me:38000',
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

        // const isCompliant = await isAddressCompliant(address, darkPool)
        // if (!isCompliant) {
        //     throw new DarkpoolError('Address is not compliant')
        // }

        const amount = 1n * 10n ** 18n;
        const wethAddress = config.networkConfig.nativeWrapper;
        updatePendingToast(undefined, "Wrapping ETH")
        await wrapEth(wethAddress, amount);

        const depositService = new DepositService(darkPool)
        const { context: depositContext, outNotes: [depositNote] } = await depositService.prepare(wethAddress, amount, address, signedMessage)
        await depositService.generateProof(depositContext)
        const depositTx = await depositService.execute(depositContext)
        await waitForTransactionReceipt(wagmiConfig, {
            confirmations: 3,
            hash: depositTx as HexData
        })

        const outToken = {
            address: '0x833589fcd6edb6e08f4c7c32d4f71b54bda02913',
            decimals: 6,
            symbol: 'USDC',
            name: 'USD Coin'
        }

        const deadline = new Date().getTime() + PROOF_TIME + DEADLINE;

        const aerodromeSwapService = new AerodromeSwapService(darkPool)
        const { context: aerodromeContext } = await aerodromeSwapService.prepare({
            inNote: depositNote,
            outAsset: outToken,
            minExpectedOutAmount: 0n,
            deadline: deadline,
            routes: [
                {
                    from: wethAddress,
                    to: outToken.address,
                    stable: false,
                    factory: "0x420DD381b31aEf6683db6B902084cB0FFECe40Da",
                }
            ],
            gasRefundInOutToken: 0n,
        }, signedMessage)

        updatePendingToast(undefined, "Generating Proof & Withdrawing")

        await aerodromeSwapService.generateProof(aerodromeContext);
        const { txHash, note } = await aerodromeSwapService.executeAndWaitForResult(aerodromeContext);
        console.log(txHash, note)
    }

    return {
        execute,
    }
}