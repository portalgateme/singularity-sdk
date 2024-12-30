import { Note } from "@thesingularitynetwork/darkpool-v1-proof"

export type DarkPoolTakerSwapMessage = {
    inNote: Note,
    outNote: Note,
    publicKey: { x: bigint, y: bigint }
    swapSignature: number[]
}