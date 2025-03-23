import { createConfig, http } from 'wagmi';
import { hardhat } from 'wagmi/chains';
import { injected } from 'wagmi/connectors';
import { config } from "./constants/config";
import { FallbackProvider, JsonRpcProvider } from 'ethers'
import { useMemo } from 'react'
import { defineChain, type Account, type Chain, type Client, type Transport } from 'viem'
import { type Config, useClient, useConnectorClient } from 'wagmi'
import { BrowserProvider, JsonRpcSigner } from 'ethers'
import { ChainId } from './types';

const hardhatBase = defineChain({
    id: ChainId.HARDHAT_BASE,
    name: 'Hardhat Base',
    nativeCurrency: {
      decimals: 18,
      name: 'Ether',
      symbol: 'ETH',
    },
    rpcUrls: {
      default: { http: ['http://127.0.0.1:8545'] },
    },
  })

export const wagmiConfig = createConfig({
    chains: [hardhatBase],
    connectors: [
        injected({ target: 'metaMask' }),
    ],
    ssr: true,
    transports: {
        // [hardhat.id]: http(config.rpcUrl),
        [ChainId.HARDHAT_BASE]: http(config.rpcUrl),
    },
})

export function clientToProvider(client: Client<Transport, Chain>) {
    const { chain, transport } = client
    const network = {
        chainId: chain.id,
        name: chain.name,
        ensAddress: chain.contracts?.ensRegistry?.address,
    }
    if (transport.type === 'fallback') {
        const providers = (transport.transports as ReturnType<Transport>[]).map(
            ({ value }) => new JsonRpcProvider(value?.url, network),
        )
        if (providers.length === 1) return providers[0]
        return new FallbackProvider(providers)
    }
    return new JsonRpcProvider(transport.url, network)
}

/** Action to convert a viem Client to an ethers.js Provider. */
export function useEthersProvider({ chainId }: { chainId?: number } = {}) {
    const client = useClient<Config>({ chainId })
    return useMemo(() => (client ? clientToProvider(client) : undefined), [client])
}


export function clientToSigner(client: Client<Transport, Chain, Account>) {
    const { account, chain, transport } = client
    const network = {
        chainId: chain.id,
        name: chain.name,
        ensAddress: chain.contracts?.ensRegistry?.address,
    }
    const provider = new BrowserProvider(transport, network)
    const signer = new JsonRpcSigner(provider, account.address)
    return signer
}

/** Hook to convert a viem Wallet Client to an ethers.js Signer. */
export function useEthersSigner({ chainId }: { chainId?: number } = {}) {
    const { data: client } = useConnectorClient<Config>({ chainId })
    return useMemo(() => (client ? clientToSigner(client) : undefined), [client])
}