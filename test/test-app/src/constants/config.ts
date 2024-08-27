import { networkConfig } from './networkConfig';
import { tokenConfig } from './tokenConfig';

const CHAIN_ID = Number(process.env.NEXT_PUBLIC_CHAIN_ID) || (() => { throw new Error('NEXT_PUBLIC_CHAIN_ID is not defined'); })()
const RPC_URL = process.env.NEXT_PUBLIC_RPC_URL || (() => { throw new Error('NEXT_PUBLIC_RPC_URLS is not defined'); })()

export const config = {
  chainId: CHAIN_ID,
  networkConfig: networkConfig[CHAIN_ID],
  rpcUrl: RPC_URL,
  relayers: [],
  tokens: tokenConfig[CHAIN_ID],
  topTokens: tokenConfig[CHAIN_ID].filter(token => token.isTop),
  popularTokens: tokenConfig[CHAIN_ID].filter(token => token.popular),
}