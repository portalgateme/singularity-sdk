import { hexlify32 } from "../../utils/util";
import { ethers } from "ethers";
import ERC20Abi from '../../abis/IERC20.json';
import ERC20_USDT from '../../abis/IERC20_USDT.json';
import { DarkPool } from "../../darkpool";
import { legacyTokenConfig } from '../../config/config';

const MAX_ALLOWANCE = BigInt('115792089237316195423570985008687907853269984665640564039457584007913129639935'); // 2**256 - 1

export async function allowance(darkPool: DarkPool, asset: string, spender: string, amount: bigint) {
  const signer = darkPool.signer;
  const allowanceContract = new ethers.Contract(asset, ERC20Abi.abi, darkPool);
  const allowance = await allowanceContract.allowance(
    signer.getAddress(),
    spender
  );
  if (BigInt(allowance) < amount) {
    const isLegacy =
      legacyTokenConfig.hasOwnProperty(darkPool.chainId) &&
      legacyTokenConfig[darkPool.chainId].includes(asset.toLowerCase());
    const contract = new ethers.Contract(asset, isLegacy ? ERC20_USDT.abi : ERC20Abi.abi, signer);
    const tx = await contract.approve(spender, hexlify32(MAX_ALLOWANCE));
    await tx.wait();
  }
}