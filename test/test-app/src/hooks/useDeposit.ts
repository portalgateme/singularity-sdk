import { EMPTY_NOTE, NoteType } from "@thesingularitynetwork/darkpool-v1-proof"
import { DefiInfraRequest, DefiInfraService, DepositService, darkPool } from "@thesingularitynetwork/mm-sdk"
import { AbiCoder } from "ethers"
import { useAccount } from "wagmi"
import { config } from "../constants"
import { networkConfig } from "../constants/networkConfig"
import { useToast } from "../contexts/ToastContext/hooks"
import { DarkpoolError, TokenConfig } from "../types"
import { useEthersSigner } from "../wagmi"
import { useSignMessage } from "./useSignMessage"
import { waitForTransactionReceipt } from "viem/actions"

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
                hostUrl: 'http://localhost:8000',
            }
        ], {
            priceOracle: config.networkConfig.priceOracle,
            ethAddress: config.networkConfig.ethAddress,
            nativeWrapper: config.networkConfig.nativeWrapper,
            complianceManager: config.networkConfig.complianceManager,
            merkleTreeOperator: config.networkConfig.merkleTreeOperator,
            darkpoolAssetManager: config.networkConfig.darkpoolAssetManager,
            drakpoolSubgraphUrl: '',
            uniswapConfig: {
                swapRouterAddress: '0x68b3465833fb72A70ecDF485E0e4C7bD8665Fc45',
                quoterContractAddress: '0x61fFE014bA17989E743c5F6cB21bF9697530B21e',
                wrappedNativeTokenAddress: '0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2',
                v3PosNftAddress: '0xC36442b4a4522E871399CD717aBDD847Ab11FE88',
                factoryAddress: '0x1F98431c8aD98523631AE4a59f267346ea31F984',
                subgraphUrl: 'https://api.thegraph.com/subgraphs/name/uniswap/uniswap-v3?source=uniswap'
            },
        })
        // const depositService = new DepositService()
        // const { context, outNotes } = await depositService.prepare({
        //     symbol: asset.symbol,
        //     name: asset.name,
        //     decimals: asset.decimals,
        //     address: asset.address,
        // }, amount, address, signature)

        // updatePendingToast(undefined, "Generating Proof")
        // await depositService.generateProof(context)


        // updatePendingToast(undefined, "Calling contract")
        // const txId = await depositService.execute(context)

        // const ethNote = outNotes[0];
        const ethNote = {
            amount: 1000000000000000000n,
            asset:"0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE",
            note: 15955092430626130633002645005166921609770356299703347039194450464529722216465n,
            rho: 205314075303279360390769526663366794992399893517922447507205584512156282418n,
        }

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
        await infraService.execute(infraContext)

    }

    return {
        execute
    }
}