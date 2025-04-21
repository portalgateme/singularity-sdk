import { calcNullifier, getNullifier, Note, validateNote } from '@thesingularitynetwork/darkpool-v1-proof';
import { DarkPool } from '../darkpool';
import { hexlify32 } from '../utils/util';
import { ethers } from 'ethers';
import MerkleAbi from '../abis/MerkleTreeOperator.json';
import { NoteOnChainStatus } from '../entities';

function getContract(address: string, darkPool: DarkPool) {
  const provider = darkPool.provider;
  return new ethers.Contract(address, MerkleAbi.abi, provider);
}

async function getNoteOnChainStatus(darkPool: DarkPool, note: string, nullifier: string) {
  const contract = getContract(darkPool.contracts.merkleTreeOperator, darkPool);
  const isCreated = (await contract.noteCommitmentsCreated(note)) as boolean;
  if (!isCreated) {
    return NoteOnChainStatus.UNKNOWN;
  }
  const isSpent = (await contract.nullifiersUsed(nullifier)) as boolean;
  if (isSpent) {
    return NoteOnChainStatus.SPENT;
  }
  const isLocked = (await contract.nullifiersLocked(nullifier)) as boolean;
  if (isLocked) {
    return NoteOnChainStatus.LOCKED;
  }
  return NoteOnChainStatus.ACTIVE;
}

export async function getNoteOnChainStatusByPublicKey(
  darkPool: DarkPool,
  note: Note,
  publicKey: any
): Promise<NoteOnChainStatus> {
  const nullifier = calcNullifier(note.rho, publicKey);
  const onChainStatus = await getNoteOnChainStatus(darkPool, hexlify32(note.note), hexlify32(nullifier));
  return onChainStatus;
}

export async function getNoteOnChainStatusBySignature(
  darkPool: DarkPool,
  note: Note,
  signature: string
): Promise<NoteOnChainStatus> {
  const nullifier = await getNullifier({
    rho: note.rho,
    signedMessage: signature
  });
  const onChainStatus = await getNoteOnChainStatus(darkPool, hexlify32(note.note), nullifier);
  return onChainStatus;
}

export async function isNoteActive(darkPool: DarkPool, note: Note, signature: string): Promise<boolean> {
  const nullifier = await getNullifier({
    rho: note.rho,
    signedMessage: signature
  });
  const onChainStatus = await getNoteOnChainStatus(darkPool, hexlify32(note.note), nullifier);
  return onChainStatus === NoteOnChainStatus.ACTIVE;
}

export async function isNoteSpent(darkPool: DarkPool, note: Note, signature: string) {
  const nullifier = await getNullifier({
    rho: note.rho,
    signedMessage: signature
  });
  const onChainStatus = await getNoteOnChainStatus(darkPool, hexlify32(note.note), nullifier);
  return onChainStatus === NoteOnChainStatus.SPENT;
}

export async function isNoteLocked(darkPool: DarkPool, note: Note, signature: string) {
  const nullifier = await getNullifier({
    rho: note.rho,
    signedMessage: signature
  });
  const onChainStatus = await getNoteOnChainStatus(darkPool, hexlify32(note.note), nullifier);
  return onChainStatus === NoteOnChainStatus.LOCKED;
}

export async function isNoteValid(note: Note, signature: string) {
  return await validateNote(note, signature);
}

export async function isNftNoteValid(note: Note, signature: string) {
  return await validateNote(note, signature);
}
