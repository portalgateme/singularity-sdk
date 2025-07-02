import { ethers } from 'ethers';
import MerkleAbi from '../abis/MerkleTreeOperator.json';
import { DarkPool } from '../darkpool';
import { hexlify32 } from '../utils/util';

export interface MerklePath {
  noteCommitment: bigint;
  path: string[];
  index: number[];
  root: string;
}

function getContract(address: string, darkPool: DarkPool) {
  const provider = darkPool.provider;
  return new ethers.Contract(address, MerkleAbi.abi, provider);
}

export async function getMerklePathAndRoot(note: bigint, darkPool: DarkPool) {
  const contract = getContract(darkPool.contracts.merkleTreeOperator, darkPool);
  const [path, index, root] = await contract.getMerklePath(hexlify32(note));
  return { path, index: index.map((x: boolean) => (x ? 1 : 0)), root };
}

export async function multiGetMerklePathAndRoot(notes: bigint[], darkPool: DarkPool): Promise<MerklePath[]> {
  const contract = getContract(darkPool.contracts.merkleTreeOperator, darkPool);

  const blockNumber = await darkPool.provider.getBlockNumber();

  const [root, ...results] = await Promise.all([
    contract.getMerkleRoot({ blockTag: blockNumber }),
    ...notes.map(note => contract.getMerklePath(hexlify32(note), { blockTag: blockNumber }))
  ]);

  return results.map(([path, index, _], i) => ({
    noteCommitment: notes[i],
    path,
    index: index.map((x: boolean) => (x ? 1 : 0)),
    root
  }));
}
