import { ethers } from 'ethers';
import IComplianceManagerAbi from '../abis/IComplianceManager.json';
import { DarkPool } from '../darkpool';

export async function isAddressCompliant(address: string, darkPool: DarkPool): Promise<boolean> {
  const provider = darkPool.provider;
  const contract = new ethers.Contract(darkPool.contracts.complianceManager, IComplianceManagerAbi.abi, provider);

  return await contract.isAuthorized.staticCall(darkPool.contracts.darkpoolAssetManager, address);
}
