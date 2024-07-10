import { TokenConfig } from '../types'
import invariant from 'tiny-invariant'
import { ethers } from 'ethers'
import { networkConfig } from '../constants/networkConfig'


export function isAddressEquals(address1: string, address2: string) {
  return ethers.getAddress(address1) === ethers.getAddress(address2)
}


export function isNotNativeCurrencyByChain(asset: string, chainId: number) {
  return asset.toLowerCase() != networkConfig[chainId].ethAddress.toLowerCase()
}

export function isNativeCurrencyByChain(asset: string, chainId: number) {
  return asset.toLowerCase() == networkConfig[chainId].ethAddress.toLowerCase()
}


export function isNativeWrappedCurrencyByChain(asset: string, chainId: number) {
  return asset.toLowerCase() == networkConfig[chainId].nativeWrapper.toLowerCase()
}

export function tokenSortsBefore(tokenA: TokenConfig, tokenB: TokenConfig) {
  invariant(
    tokenA.address.toLowerCase() !== tokenB.address.toLowerCase(),
    'ADDRESSES',
  )
  return tokenA.address.toLowerCase() < tokenB.address.toLowerCase()
}


export function hexEquals(hex1: string, hex2: string) {
  if(!hex1 || !hex2) {
    return false
  }

  return hex1.toLowerCase() === hex2.toLowerCase()
}

export function hexInArray(hex: string, array: string[]) {
  return array.some((item) => hexEquals(item, hex))
}
