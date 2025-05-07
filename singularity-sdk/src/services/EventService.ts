import { ethers } from 'ethers';
import { DarkPool } from '../darkpool';

export async function getOutEvent(tx: string, abi: any, eventTopic: string, darkPool: DarkPool) {
  const iface = new ethers.Interface(abi);
  const receipt = await darkPool.provider.getTransactionReceipt(tx);
  if (receipt && receipt.logs.length > 0) {
    for (let i = 0; i < receipt.logs.length; i++) {
      const parsedLog = iface.parseLog(receipt.logs[i]);
      if (parsedLog && parsedLog.name === eventTopic) {
        return parsedLog;
      }
    }
  }

  return null;
}
