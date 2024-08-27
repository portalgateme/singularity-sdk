import { NetworkConfig, ChainId } from '../types'

export const networkConfig: { [chainId: number]: NetworkConfig } = {
  [ChainId.HARDHAT]: {
    priceOracle: '0x0AdDd25a91563696D8567Df78D5A01C9a991F9B8',
    ethAddress: '0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE',
    nativeWrapper: '0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2',
    merkleTreeOperator: '0xCC5Bc84C3FDbcF262AaDD9F76652D6784293dD9e',
    complianceManager: '0x987Aa6E80e995d6A76C4d061eE324fc760Ea9F61',
    darkpoolAssetManager: '0xe24e7570Fe7207AdAaAa8c6c89a59850391B5276',
    stakingOperator: '0x6B9C4119796C80Ced5a3884027985Fd31830555b',
    stakingAssetManager: '0xCd9BC6cE45194398d12e27e1333D5e1d783104dD',
    mockDex: '0x29023DE63D7075B4cC2CE30B55f050f9c67548d4',
    drakpoolSubgraphUrl:
      'https://34.142.142.240:8080/subgraphs/name/singularity/',
    explorerUrl: {
      tx: 'https://sepolia.etherscan.io/tx/',
      address: 'https://sepolia.etherscan.io/address/',
      block: 'https://sepolia.etherscan.io/block/',
    },
  },
}
