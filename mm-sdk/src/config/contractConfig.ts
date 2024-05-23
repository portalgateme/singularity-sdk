import { ChainId } from "./chain"

export type HexData = `0x${string}`

export type ContractConfiguartion = {
    priceOracle: HexData
    ethAddress: HexData
    nativeWrapper: HexData
    complianceManager: HexData
    merkleTreeOperator: HexData
    darkpoolAssetManager: HexData
    drakpoolSubgraphUrl: string
    uniswapConfig: {
        swapRouterAddress: HexData
        quoterContractAddress: HexData
        wrappedNativeTokenAddress: HexData
        v3PosNftAddress: HexData
        factoryAddress: HexData
        subgraphUrl: string
    }
}

export const contractConfig: { [chainId: number]: ContractConfiguartion } = {
    [ChainId.MAINNET]: {
        priceOracle: '0x0AdDd25a91563696D8567Df78D5A01C9a991F9B8',
        ethAddress: '0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE',
        nativeWrapper: '0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2',
        complianceManager: '0x630aD89523a18fA30F752297F3F53B7BC363488b',
        merkleTreeOperator: '0x152f1051c8D37Fba9A362Fc9b32a0eeF8496202F',
        darkpoolAssetManager: '0x159F3668c72BBeCdF1fb31beeD606Ec9649654eB',
        drakpoolSubgraphUrl: 'https://subgraph.satsuma-prod.com/1c6a44a9ed6e/pgs-team--611591/singularity-subgraph/version/v0.0.1/api',
        uniswapConfig: {
            swapRouterAddress: '0x68b3465833fb72A70ecDF485E0e4C7bD8665Fc45',
            quoterContractAddress: '0x61fFE014bA17989E743c5F6cB21bF9697530B21e',
            wrappedNativeTokenAddress: '0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2',
            v3PosNftAddress: '0xC36442b4a4522E871399CD717aBDD847Ab11FE88',
            factoryAddress: '0x1F98431c8aD98523631AE4a59f267346ea31F984',
            subgraphUrl: 'https://api.thegraph.com/subgraphs/name/uniswap/uniswap-v3?source=uniswap'
        },
    },
    [ChainId.HARDHAT]: {
        priceOracle: '0x0AdDd25a91563696D8567Df78D5A01C9a991F9B8',
        ethAddress: '0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE',
        nativeWrapper: '0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2',
        complianceManager: '0x6B9C4119796C80Ced5a3884027985Fd31830555b',
        merkleTreeOperator: '0xabebE9a2D62Af9a89E86EB208b51321e748640C3',
        darkpoolAssetManager: '0x0BbfcD7a557FFB8A70CB0948FF680F0E573bbFf2',
        drakpoolSubgraphUrl: 'http://localhost:8000/subgraphs/name/singularity/',
        uniswapConfig: {
            swapRouterAddress: '0x68b3465833fb72A70ecDF485E0e4C7bD8665Fc45',
            quoterContractAddress: '0x61fFE014bA17989E743c5F6cB21bF9697530B21e',
            wrappedNativeTokenAddress: '0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2',
            v3PosNftAddress: '0xC36442b4a4522E871399CD717aBDD847Ab11FE88',
            factoryAddress: '0x1F98431c8aD98523631AE4a59f267346ea31F984',
            subgraphUrl: 'https://api.thegraph.com/subgraphs/name/uniswap/uniswap-v3?source=uniswap'
        },
    },
}