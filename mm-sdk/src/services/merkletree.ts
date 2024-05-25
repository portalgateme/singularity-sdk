import MerkleAbi from '../abis/MerkleTreeOperator.json'
import { ethers } from "ethers";
import { darkPool } from '../darkpool';
import { mimc_bn254 } from '../utils/mimc';
import { hexlify32, isHexEquals } from '../utils/util';
import { DarkpoolError } from '../entities';

const DOMAIN_SEPARATOR_LEAF = 0n;

export interface MerklePath {
  noteCommitment: bigint;
  path: string[];
  index: number[];
  root: string;
}

function getContract(address: string) {
  const provider = darkPool.provider;
  return new ethers.Contract(address, MerkleAbi.abi, provider);
}

async function getAllMerkleNodes() {
  const contract = getContract(darkPool.contracts.merkleTreeOperator);
  return await contract.getmerkleNodes() as string[][];
}

export async function getMerklePathAndRoot(note: bigint) {
  const merkleTree = await getAllMerkleNodes();
  return getMerklePath(merkleTree, note);
}

function getMerklePath(merkleNodes: string[][], noteCommitment: bigint): MerklePath {
  let index = 0;
  let found = false;

  let leaf = hexlify32(mimc_bn254([DOMAIN_SEPARATOR_LEAF, noteCommitment]));

  while (index < merkleNodes[0].length) {
    if (isHexEquals(merkleNodes[0][index], leaf)) {
      found = true;
      break;
    }
    index++;
  }

  if (!found)
    throw new DarkpoolError('Note not found in the merkle tree:' + noteCommitment);

  const path: string[] = Array(32).fill('0x0');
  const isLeft: boolean[] = new Array(32).fill(false);
  let root = leaf;

  for (let i = 0; i < 32; i++) {
    if (index === 0 && merkleNodes[i].length === 1) {
      root = merkleNodes[i][index];
      break;
    }

    if (index % 2 === 0) {
      if (index === merkleNodes[i].length - 1) {
        path[i] = '0x0';
      } else {
        path[i] = merkleNodes[i][index + 1];
      }
      isLeft[i] = false;
    } else {
      path[i] = merkleNodes[i][index - 1];
      isLeft[i] = true;
    }
    index = Math.floor(index / 2);
  }

  return { noteCommitment, path, index: isLeft.map((x) => x ? 1 : 0), root };
}

export async function multiGetMerklePathAndRoot(notes: bigint[]) {
  const merkleTree = await getAllMerkleNodes();
  return notes.map((note) => getMerklePath(merkleTree, note));
}