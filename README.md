# singularity-sdk
## Setup
Install from npm:

`yarn add @thesingularitynetwork/singularity-sdk`

## Init
```ts
import { darkPool } from "@thesingularitynetwork/singularity-sdk"
import { config } from "../constants"

#sepolia
const chainId = 11155111
darkPool.init(signer, chainId, [
        {
            relayerName: '',
            relayerAddress: '0x0A20B38894799fD27837aF3Ed8929E7b8d1dDDe7',  #for sepolia
            hostUrl: 'https://34.142.142.240:20000',                       #for sepolia
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
            drakpoolSubgraphUrl: ''
        })
```
