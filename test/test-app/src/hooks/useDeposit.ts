import { EMPTY_NOTE, Note, NoteType } from "@thesingularitynetwork/darkpool-v1-proof"
import { DefiInfraRequest, DefiInfraService, DepositService, WithdrawService, darkPool } from "@thesingularitynetwork/mm-sdk"
import { AbiCoder } from "ethers"
import { useAccount } from "wagmi"
import { config } from "../constants"
import { networkConfig } from "../constants/networkConfig"
import { useToast } from "../contexts/ToastContext/hooks"
import { DarkpoolError, HexData, TokenConfig } from "../types"
import { useEthersSigner, wagmiConfig } from "../wagmi"
import { useSignMessage } from "./useSignMessage"
import { waitForTransactionReceipt } from '@wagmi/core'

export const useDeposit = () => {

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
                hostUrl: 'https://34.142.142.240:18000',
            }
        ], {
            priceOracle: config.networkConfig.priceOracle,
            ethAddress: config.networkConfig.ethAddress,
            nativeWrapper: config.networkConfig.nativeWrapper,
            complianceManager: config.networkConfig.complianceManager,
            merkleTreeOperator: config.networkConfig.merkleTreeOperator,
            darkpoolAssetManager: config.networkConfig.darkpoolAssetManager,
            drakpoolSubgraphUrl: ''
        })
        const depositService = new DepositService()
        const { context, outNotes } = await depositService.prepare({
            symbol: asset.symbol,
            name: asset.name,
            decimals: asset.decimals,
            address: asset.address,
        }, amount, address, signature)

        updatePendingToast(undefined, "Generating Proof")
        await depositService.generateProof(context)


        updatePendingToast(undefined, "Depositing")
        const txId = await depositService.execute(context)

        updatePendingToast(undefined, "Waiting for Confirmation")
        const receipt = await waitForTransactionReceipt(wagmiConfig, {
            confirmations: 3,
            hash: txId as HexData })

        console.log(receipt)

        const ethNote = outNotes[0];

        console.log(ethNote)

        const defiParameters = new AbiCoder().encode(
            ['uint256', 'uint256'],
            [ethNote.amount, ethNote.amount * 8n / 10n])


        const request: DefiInfraRequest = {
            inNoteTpye: NoteType.Fungible,
            inNote1: ethNote,
            inNote2: null,
            inNote3: null,
            inNote4: null,
            contractAddress: networkConfig[chainId].mockDex,
            defiParameters,
            outNoteType: NoteType.Fungible,
            outAsset1: networkConfig[chainId].nativeWrapper,
            outAsset2: null,
            outAsset3: null,
            outAsset4: null,
        }

        const infraService = new DefiInfraService()
        const { context: infraContext, outPartialNotes } = await infraService.prepare(request, signature)
        updatePendingToast(undefined, "Generating Proof")
        await infraService.generateProof(infraContext)
        updatePendingToast(undefined, "Executing")
        const notes = await infraService.executeAndWaitForResult(infraContext)

        console.log(notes)

        const withdrawService = new WithdrawService()
        const { context: withdrawContext } = await withdrawService.prepare(notes[0] as Note, address, signature)
        updatePendingToast(undefined, "Generating Proof")
        await withdrawService.generateProof(withdrawContext)
        updatePendingToast(undefined, "Executing")
        await withdrawService.executeAndWaitForResult(withdrawContext)
    }

    return {
        execute
    }
}