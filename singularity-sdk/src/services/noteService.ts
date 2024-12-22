import { getNullifier, Note, validateNote } from "@thesingularitynetwork/darkpool-v1-proof";
import { DarkPool } from "../darkpool";
import { hexlify32 } from "../utils/util";
import { ethers } from "ethers";
import MerkleAbi from '../abis/MerkleTreeOperator.json'


function getContract(address: string, darkPool: DarkPool) {
    const provider = darkPool.provider;
    return new ethers.Contract(address, MerkleAbi.abi, provider);
}

export async function isNoteCommitmentValidOnChain(
    darkPool: DarkPool,
    note: bigint,
): Promise<boolean> {
    try {
        const contract = getContract(darkPool.contracts.merkleTreeOperator, darkPool);
        return await contract.noteCommitmentsCreated(hexlify32(note)) as boolean;
    } catch (e) {
        console.log(e)
        return false
    }
}

export async function isNoteSpent(darkPool: DarkPool, note: Note, signature: string) {
    const nullifier = await getNullifier({
        rho: note.rho,
        signedMessage: signature,
    })
    const contract = getContract(darkPool.contracts.merkleTreeOperator, darkPool);
    return await contract.nullifiersUsed(nullifier) as boolean;
}

export async function isNoteValid(note: Note, signature: string) {
    return await validateNote(note, signature);
}

export async function isNftNoteValid(note: Note, signature: string) {
    return await validateNote(note, signature);
}