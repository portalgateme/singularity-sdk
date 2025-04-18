import { NetworkConfig, ChainId, HexData } from '../types'
import hardhatBase from './contracts/hardhatBase.json'

export const networkConfig: { [chainId: number]: NetworkConfig } = {
  [ChainId.HARDHAT]: {
    priceOracle: '0x0AdDd25a91563696D8567Df78D5A01C9a991F9B8',
    ethAddress: '0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE',
    nativeWrapper: '0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2',
    merkleTreeOperator: '0x10537D7bD661C9c34F547b38EC662D6FD482Ae95',
    complianceManager: '0x64079a2Edd1104a2323E2b732A1244BCE011B1F5',
    darkpoolAssetManager: '0xA496E0071780CF57cd699cb1D5Ac0CdCD6cCD673',
    stakingOperator: '0xFE92134da38df8c399A90a540f20187D19216E05',
    stakingAssetManager: '0x1966dc8ff30Bc4AeDEd27178642253b3cCC9AA3f',
    otcSwapAssetManager: '0x26Df0Ea798971A97Ae121514B32999DfDb220e1f',
    batchJoinSplitAssetManager: '0x0',
    darkpoolSwapAssetManager: '0x0',
    mockDex: '0x29023DE63D7075B4cC2CE30B55f050f9c67548d4',
    drakpoolSubgraphUrl:
      'https://app.dev.portalgate.me:8080/subgraphs/name/singularity/',
    explorerUrl: {
      tx: 'https://sepolia.etherscan.io/tx/',
      address: 'https://sepolia.etherscan.io/address/',
      block: 'https://sepolia.etherscan.io/block/',
    },
  },
  [ChainId.HARDHAT_BASE]: {
    priceOracle: '0xf224a25453D76A41c4427DD1C05369BC9f498444',
    ethAddress: '0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE',
    nativeWrapper: '0x4200000000000000000000000000000000000006',
    complianceManager: hardhatBase.accessPortal as HexData,
    merkleTreeOperator: hardhatBase.merkleTreeOperator as HexData,
    darkpoolAssetManager: hardhatBase.darkpoolAssetManager as HexData,
    stakingOperator: hardhatBase.stakingOperator as HexData,
    stakingAssetManager: hardhatBase.stakingAssetManager as HexData,
    otcSwapAssetManager: hardhatBase.oTCSwapAssetManager as HexData,
    batchJoinSplitAssetManager: hardhatBase.batchJoinSplitAssetManager as HexData,
    darkpoolSwapAssetManager: hardhatBase.darkPoolSwapAssetManager as HexData,
    mockDex: '0x29023DE63D7075B4cC2CE30B55f050f9c67548d4',
    drakpoolSubgraphUrl:
      'https://app.dev.portalgate.me:8080/subgraphs/name/singularity/',
    explorerUrl: {
      tx: 'https://sepolia.etherscan.io/tx/',
      address: 'https://sepolia.etherscan.io/address/',
      block: 'https://sepolia.etherscan.io/block/',
    },
  }
}
