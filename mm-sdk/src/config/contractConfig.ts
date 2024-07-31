import { ChainId } from "./chain"

export type ContractConfiguartion = {
    priceOracle: string
    ethAddress: string
    nativeWrapper: string
    complianceManager: string
    merkleTreeOperator: string
    darkpoolAssetManager: string
    stakingOperator: string
    stakingAssetManager: string
    drakpoolSubgraphUrl: string
    uniswapConfig?: {
        swapRouterAddress: string
        quoterContractAddress: string
        wrappedNativeTokenAddress: string
        v3PosNftAddress: string
        factoryAddress: string
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
        stakingOperator: '0x539bcbc08F2cA42E50887dA4Db0DC34EbF0B090b',
        stakingAssetManager: '0x1Fa7Cb4925086128f3bb9e26761C9C75dbAC3CD1',
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
    [ChainId.ARBITRUM_ONE]: {
        priceOracle: '0x0AdDd25a91563696D8567Df78D5A01C9a991F9B8',
        ethAddress: '0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE',
        nativeWrapper: '0x82af49447d8a07e3bd95bd0d56f35241523fbab1',
        stakingOperator: '0xF4f1D4F28Be82D81135c13D255452B8325B585B0',
        stakingAssetManager: '0xB1CC5D9227323330E8a58e891c123B38D03f0BAA',
        complianceManager: '0x23A37b553c46f4864537Ab1e8d1e49804b47A5A7',
        merkleTreeOperator: '0x0e2aCb73EBB02bd4099d495bcb96F7522F84ddb7',
        darkpoolAssetManager: '0xf7C40b5057a1D1a3d58B02BCdb125E63ef380564',
        drakpoolSubgraphUrl:
            'https://subgraph.satsuma-prod.com/1c6a44a9ed6e/pgs-team--611591/singularity-arb-subgraph/api',
    },
    [ChainId.HARDHAT]: {
        priceOracle: '0x0AdDd25a91563696D8567Df78D5A01C9a991F9B8',
        ethAddress: '0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE',
        nativeWrapper: '0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2',
        merkleTreeOperator: '0xCC5Bc84C3FDbcF262AaDD9F76652D6784293dD9e',
        complianceManager: '0x987Aa6E80e995d6A76C4d061eE324fc760Ea9F61',
        darkpoolAssetManager: '0xe24e7570Fe7207AdAaAa8c6c89a59850391B5276',
        stakingOperator: '0x6B9C4119796C80Ced5a3884027985Fd31830555b',
        stakingAssetManager: '0xCd9BC6cE45194398d12e27e1333D5e1d783104dD',
        drakpoolSubgraphUrl:
            'https://34.142.142.240:8080/subgraphs/name/singularity/',
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