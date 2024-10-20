import { Note } from "@thesingularitynetwork/darkpool-v1-proof"
import { RedeemService, StakeNoteService, StakeService, WithdrawService, darkPool } from "@thesingularitynetwork/singularity-sdk"
import { waitForTransactionReceipt } from '@wagmi/core'
import { useAccount } from "wagmi"
import { config } from "../constants"
import { useToast } from "../contexts/ToastContext/hooks"
import { DarkpoolError, HexData, TokenConfig } from "../types"
import { useEthersSigner, wagmiConfig } from "../wagmi"
import { useSignMessage } from "./useSignMessage"

export const useStake = () => {

    const chainId = config.chainId
    const { address, isConnected } = useAccount()
    const signer = useEthersSigner()
    const { showPendingToast, showSuccessToast, closeToast, updatePendingToast } = useToast()
    const { signMessageAsync } = useSignMessage()


    const execute = async (asset: TokenConfig, amount: bigint) => {
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
            stakingOperator: config.networkConfig.stakingOperator,
            stakingAssetManager: config.networkConfig.stakingAssetManager,
            otcSwapAssetManager: config.networkConfig.otcSwapAssetManager,
            drakpoolSubgraphUrl: ''
        }, [
            {
                originalToken: {
                    address: '0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE',
                    decimals: 18,
                    symbol: 'ETH',
                    name: 'Ethereum',
                },
                stakingToken: {
                    address: '0x5fe2f174fe51474Cd198939C96e7dB65983EA307',
                    decimals: 18,
                    symbol: 'sgETH',
                    name: 'sgETH',
                },
            },
        ])

        const stakeService = new StakeService()
        const { context: stakeContext, outNotes } = await stakeService.prepare({
            symbol: asset.symbol,
            name: asset.name,
            decimals: asset.decimals,
            address: asset.address,
        }, amount, address, signature)

        updatePendingToast(undefined, "Generating Proof")
        await stakeService.generateProof(stakeContext)

        updatePendingToast(undefined, "Depositing")
        const txId = await stakeService.execute(stakeContext)

        updatePendingToast(undefined, "Waiting for Confirmation")
        const receipt = await waitForTransactionReceipt(wagmiConfig, {
            confirmations: 1,
            hash: txId as HexData
        })

        const sgEthNote = outNotes[0];

        console.log(sgEthNote)

        const redeemService = new RedeemService()
        const { context: redeemContext } = await redeemService.prepare(sgEthNote, signature)
        updatePendingToast(undefined, "Generating Redeem Proof")
        await redeemService.generateProof(redeemContext)
        updatePendingToast(undefined, "Calling redeem")
        const notes = await redeemService.executeAndWaitForResult(redeemContext)

        console.log(notes[0])

        const stakeNoteService = new StakeNoteService()
        const { context: stakeNoteContext } = await stakeNoteService.prepare(notes[0] as Note, signature)
        updatePendingToast(undefined, "Generating Stake Note Proof")
        await stakeNoteService.generateProof(stakeNoteContext)
        updatePendingToast(undefined, "Staking Note")
        const stakedNotes = await stakeNoteService.executeAndWaitForResult(stakeNoteContext)

        console.log(stakedNotes[0])

        const withdrawService = new WithdrawService()
        const { context: withdrawContext } = await withdrawService.prepare(stakedNotes[0] as Note, address, signature)
        updatePendingToast(undefined, "Generating Withdraw Proof")
        await withdrawService.generateProof(withdrawContext)
        updatePendingToast(undefined, "Withdrawing")
        await withdrawService.executeAndWaitForResult(withdrawContext)
    }

    return {
        execute
    }
}