import { AerodromeAddLiquidityService, AerodromeRemoveLiquidityService, AerodromeSwapService, DarkPool, DepositService, isAddressCompliant } from "@thesingularitynetwork/singularity-sdk"
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

export const useAerodromeAddLp = () => {

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
        await wrapEth(wethAddress, amount* 2n);


        updatePendingToast(undefined, "Generating Proof & Depositing WETH")

        const depositService = new DepositService(darkPool)
        const { context: depositWETHContext1, outNotes: [depositWETHNote1] } = await depositService.prepare(wethAddress, amount, address, signedMessage)
        await depositService.generateProof(depositWETHContext1)
        const depositWETHTx1 = await depositService.execute(depositWETHContext1)
        await waitForTransactionReceipt(wagmiConfig, {
            confirmations: 3,
            hash: depositWETHTx1 as HexData
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
            inNote: depositWETHNote1,
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

        updatePendingToast(undefined, "Generating Proof & Swap WETH to USDC")

        await aerodromeSwapService.generateProof(aerodromeContext);
        const { txHash, note: usdcNote } = await aerodromeSwapService.executeAndWaitForResult(aerodromeContext);
        console.log(txHash, usdcNote)

        updatePendingToast(undefined, "Generating Proof & Depositing WETH")

        const { context: depositWETHContext2, outNotes: [depositWETHNote2] } = await depositService.prepare(wethAddress, amount, address, signedMessage)
        await depositService.generateProof(depositWETHContext2)
        const depositWETHTx2 = await depositService.execute(depositWETHContext2)
        await waitForTransactionReceipt(wagmiConfig, {
            confirmations: 3,
            hash: depositWETHTx2 as HexData
        })

        updatePendingToast(undefined, "Generating Proof & Adding Liquidity")

        const aerodromeAddLpService = new AerodromeAddLiquidityService(darkPool)
        const { context: aerodromeAddLpContext } = await aerodromeAddLpService.prepare({
            inNote1: depositWETHNote2,
            inNote2: usdcNote,
            poolAddress: "0xcDAC0d6c6C59727a65F871236188350531885C43",
            lpTokenAddress: "0xcDAC0d6c6C59727a65F871236188350531885C43",
            stable: false,
            minExpectedInAmount1: depositWETHNote2.amount/2n,
            minExpectedInAmount2: usdcNote.amount/2n,
            deadline: BigInt(new Date().getTime() + PROOF_TIME + DEADLINE)
        }, signedMessage)

        await aerodromeAddLpService.generateProof(aerodromeAddLpContext)
        const { txHash: aerodromeAddLpTxHash, notes: lpNotes } = await aerodromeAddLpService.executeAndWaitForResult(aerodromeAddLpContext)
        await waitForTransactionReceipt(wagmiConfig, {
            confirmations: 3,
            hash: aerodromeAddLpTxHash as HexData
        })

        const lpTokenNote = lpNotes[0]
        console.log(lpTokenNote)

        updatePendingToast(undefined, "Generating Proof & Removing Liquidity")

        const aerodromeRemoveLiquidityService = new AerodromeRemoveLiquidityService(darkPool)
        const { context: aerodromeRemoveLiquidityContext } = await aerodromeRemoveLiquidityService.prepare({
            inNote: lpTokenNote,
            liquidityAmountBurn: lpTokenNote.amount/2n,
            stable: false,
            poolAddress: "0xcDAC0d6c6C59727a65F871236188350531885C43",
            outAsset1: {
                address: wethAddress,
                decimals: 18,
                symbol: 'WETH',
                name: 'Wrapped Ether'
            },
            outAsset2: {
                address: outToken.address,
                decimals: outToken.decimals,
                symbol: outToken.symbol,
                name: outToken.name
            },
            minExpectedOutAmount1: 1n,
            minExpectedOutAmount2: 1n,
            deadline: BigInt(new Date().getTime() + PROOF_TIME + DEADLINE)
        }, signedMessage)

        await aerodromeRemoveLiquidityService.generateProof(aerodromeRemoveLiquidityContext)
        const { txHash: aerodromeRemoveLiquidityTxHash, notes: removeLpNotes } = await aerodromeRemoveLiquidityService.executeAndWaitForResult(aerodromeRemoveLiquidityContext)
        await waitForTransactionReceipt(wagmiConfig, {
            confirmations: 3,
            hash: aerodromeRemoveLiquidityTxHash as HexData
        })

        console.log(removeLpNotes)
    }

    return {
        execute,
    }
}