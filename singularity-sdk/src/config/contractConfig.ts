import { ChainId } from './chain';

export type ContractConfiguartion = {
  priceOracle: string;
  ethAddress: string;
  nativeWrapper: string;
  complianceManager: string;
  merkleTreeOperator: string;
  darkpoolAssetManager: string;
  otcSwapAssetManager: string;
  stakingOperator: string;
  stakingAssetManager: string;
  drakpoolSubgraphUrl: string;
  batchJoinSplitAssetManager: string;
  darkpoolSwapAssetManager: string;
  nftAssetManager: string;
  theDeepAssetManager?: string;
  uniswapConfig?: {
    swapRouterAddress: string;
    quoterContractAddress: string;
    wrappedNativeTokenAddress: string;
    v3PosNftAddress: string;
    factoryAddress: string;
    subgraphUrl: string;
  };
  sablierConfig?: {
    aliasPrefixLinear: string;
    aliasPrefixDynamic: string;
    lockupLinear: string;
    lockupDynamic: string;
    sablierDynamicAssetManager: string;
    sablierLinearAssetManager: string;
  };
};

export const contractConfig: { [chainId: number]: ContractConfiguartion } = {
  [ChainId.MAINNET]: {
    priceOracle: '0x0AdDd25a91563696D8567Df78D5A01C9a991F9B8',
    ethAddress: '0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE',
    nativeWrapper: '0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2',
    complianceManager: '0x630aD89523a18fA30F752297F3F53B7BC363488b',
    merkleTreeOperator: '0x152f1051c8D37Fba9A362Fc9b32a0eeF8496202F',
    darkpoolAssetManager: '0x159F3668c72BBeCdF1fb31beeD606Ec9649654eB',
    otcSwapAssetManager: '0xB8096ecD7d3185b24AA218C509175185C11f13a9',
    stakingOperator: '0x539bcbc08F2cA42E50887dA4Db0DC34EbF0B090b',
    stakingAssetManager: '0x1Fa7Cb4925086128f3bb9e26761C9C75dbAC3CD1',
    batchJoinSplitAssetManager: '0x0', //FIXME
    darkpoolSwapAssetManager: '0x0', //FIXME
    nftAssetManager: '0x0', //FIXME
    drakpoolSubgraphUrl:
      'https://subgraph.satsuma-prod.com/1c6a44a9ed6e/pgs-team--611591/singularity-subgraph/version/v0.0.1/api',
    uniswapConfig: {
      swapRouterAddress: '0x68b3465833fb72A70ecDF485E0e4C7bD8665Fc45',
      quoterContractAddress: '0x61fFE014bA17989E743c5F6cB21bF9697530B21e',
      wrappedNativeTokenAddress: '0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2',
      v3PosNftAddress: '0xC36442b4a4522E871399CD717aBDD847Ab11FE88',
      factoryAddress: '0x1F98431c8aD98523631AE4a59f267346ea31F984',
      subgraphUrl: 'https://api.thegraph.com/subgraphs/name/uniswap/uniswap-v3?source=uniswap'
    }
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
    otcSwapAssetManager: '0xcbFA6BB3eb4Bd9BF97866baE75FfB62f3aE897c0',
    batchJoinSplitAssetManager: '0x0', //FIXME
    darkpoolSwapAssetManager: '0x0', //FIXME
    nftAssetManager: '0x0', //FIXME

    drakpoolSubgraphUrl: 'https://subgraph.satsuma-prod.com/1c6a44a9ed6e/pgs-team--611591/singularity-arb-subgraph/api'
  },
  [ChainId.BounceBit]: {
    priceOracle: '0x0',
    ethAddress: '0x0000000000000000000000000000000000000000',
    nativeWrapper: '0xF4c20e5004C6FDCDdA920bDD491ba8C98a9c5863',
    stakingOperator: '0x4d459dDe25707CA353De15CC3B85b7C2e4bb380c',
    stakingAssetManager: '0xe6B0a94e1eA206B122a11a30dA7FB9ADaA12ef42',
    complianceManager: '0x1Fe002A6E413C70D5CB8477cDaA0422fc7611fCc',
    merkleTreeOperator: '0x159F3668c72BBeCdF1fb31beeD606Ec9649654eB',
    darkpoolAssetManager: '0x722133fBb559E2849e3402De3279Bd3059b7fe4E',
    otcSwapAssetManager: '0xAa5e02284d1Fd0f6C12AFBDABc28Ed5aC5a6474b',
    batchJoinSplitAssetManager: '0x0', //FIXME
    darkpoolSwapAssetManager: '0x0', //FIXME
    nftAssetManager: '0x0', //FIXME
    drakpoolSubgraphUrl: 'https://bb.subgraph.thesingularity.network/subgraphs/name/singularity/'
  },
  [ChainId.BASE]: {
    priceOracle: '0xf224a25453D76A41c4427DD1C05369BC9f498444',
    ethAddress: '0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE',
    nativeWrapper: '0x4200000000000000000000000000000000000006',
    complianceManager: '0xFa368E046B4051582662f7d1C033756dB55058cF',
    merkleTreeOperator: '0xdcd767f6f877B4Ef85d631f23e51ff3a2BCC9378',
    darkpoolAssetManager: '0x84eb120A35802460484015e6748375369e40468a',
    stakingOperator: '0xfdA33b941E6C014bD079C6917b815EFA58976f37',
    stakingAssetManager: '0xa3d27E1Ca5057372478011FB781479B8A1fF7AA3',
    otcSwapAssetManager: '0x3D76Fd85FCc2593970d22Aa34bcC4c5444c57c9D',
    batchJoinSplitAssetManager: '0x0', //FIXME
    darkpoolSwapAssetManager: '0x0', //FIXME
    nftAssetManager: '0x0', //FIXME
    drakpoolSubgraphUrl: 'https://subgraph.satsuma-prod.com/1c6a44a9ed6e/pgs-team--611591/singularity-base-subgraph/api'
  },
  [ChainId.SEPOLIA]: {
    priceOracle: '0x4Fe44a9aC8Ef059Be2dB97f9e3bcA32Ab698C2f2',
    ethAddress: '0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE',
    nativeWrapper: '0xfFf9976782d46CC05630D1f6eBAb18b2324d6B14',
    stakingOperator: '0xca7081e8C689C2BA887cEaCcfCB1961716CF5fc9',
    stakingAssetManager: '0x5041cad705244626E8BB9bd6D828b94EEAB09D8b',
    complianceManager: '0x08DD9cEf89923EDa02F56a4d4aB3FC4a96531443',
    merkleTreeOperator: '0x84026d6f3b6A4cEa7AD00Cd5154a8537129B3742',
    darkpoolAssetManager: '0xa10d309818527C8D8F5164f9D640515d6616bFeE',
    otcSwapAssetManager: '0x549f3bAD265A0383394E0ABEC7b67b4ff750d2ca',
    batchJoinSplitAssetManager: '0x31816E27809fdc3cF73539d761133a301beEb9B0',
    darkpoolSwapAssetManager: '0x802ae625C2bdac1873B8bbb709679CC401F57abc',
    nftAssetManager: '0x0', //FIXME
    drakpoolSubgraphUrl: ''
  },
  [ChainId.BounceBitTestnet]: {
    priceOracle: '0x0',
    ethAddress: '0x0000000000000000000000000000000000000000',
    nativeWrapper: '0x0',
    stakingOperator: '0xEF8F70bB29DEAd5CEcaE26C6Cb19B987475B3e48',
    stakingAssetManager: '0x30cAA40e8D8d00fEAFc05732Ed75856f5eC7F89c',
    complianceManager: '0x1Fa7Cb4925086128f3bb9e26761C9C75dbAC3CD1',
    merkleTreeOperator: '0x40FecD96e94c3c2eE0Fb8bE5cE7073Bb3fB46F51',
    darkpoolAssetManager: '0xf21f124F395271e8435A93063AE2AD74829D7b69',
    otcSwapAssetManager: '0x0',
    batchJoinSplitAssetManager: '0x0', //FIXME
    darkpoolSwapAssetManager: '0x0', //FIXME
    nftAssetManager: '0x0', //FIXME
    drakpoolSubgraphUrl: ''
  },
  [ChainId.HARDHAT]: {
    priceOracle: '0x0AdDd25a91563696D8567Df78D5A01C9a991F9B8',
    ethAddress: '0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE',
    nativeWrapper: '0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2',
    merkleTreeOperator: '0xCC5Bc84C3FDbcF262AaDD9F76652D6784293dD9e',
    complianceManager: '0x987Aa6E80e995d6A76C4d061eE324fc760Ea9F61',
    darkpoolAssetManager: '0xe24e7570Fe7207AdAaAa8c6c89a59850391B5276',
    otcSwapAssetManager: '0x26Df0Ea798971A97Ae121514B32999DfDb220e1f',
    stakingOperator: '0x6B9C4119796C80Ced5a3884027985Fd31830555b',
    stakingAssetManager: '0xCd9BC6cE45194398d12e27e1333D5e1d783104dD',
    batchJoinSplitAssetManager: '0x0', //FIXME
    darkpoolSwapAssetManager: '0x0', //FIXME
    theDeepAssetManager: '0x0', //FIXME
    nftAssetManager: '0x886a2A3ABF5B79AA5dFF1C73016BD07CFc817e04',
    drakpoolSubgraphUrl: 'https://34.142.142.240:8080/subgraphs/name/singularity/',
    uniswapConfig: {
      swapRouterAddress: '0x68b3465833fb72A70ecDF485E0e4C7bD8665Fc45',
      quoterContractAddress: '0x61fFE014bA17989E743c5F6cB21bF9697530B21e',
      wrappedNativeTokenAddress: '0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2',
      v3PosNftAddress: '0xC36442b4a4522E871399CD717aBDD847Ab11FE88',
      factoryAddress: '0x1F98431c8aD98523631AE4a59f267346ea31F984',
      subgraphUrl: 'https://api.thegraph.com/subgraphs/name/uniswap/uniswap-v3?source=uniswap'
    },
    sablierConfig: {
      aliasPrefixLinear: 'LL2',
      aliasPrefixDynamic: 'LD2',
      lockupLinear: '0xAFb979d9afAd1aD27C5eFf4E27226E3AB9e5dCC9',
      lockupDynamic: '0x7CC7e125d83A581ff438608490Cc0f7bDff79127',
      sablierDynamicAssetManager: '0x453439300B6C5C645737324b990f2d51137027bC',
      sablierLinearAssetManager: '0xB90AcF57C3BFE8e0E8215defc282B5F48b3edC74'
    }
  }
};
