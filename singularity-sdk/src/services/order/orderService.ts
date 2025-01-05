import { DarkPoolTakerSwapMessage } from '@thesingularitynetwork/darkpool-v1-proof';
import * as crypto from 'crypto';
import { hexlify32 } from '../../utils/util';

export function encryptWithPublicKey(publicKey: string, data: string): string {
    const buffer = Buffer.from(data, 'utf8');
    const encrypted = crypto.publicEncrypt(publicKey, buffer);
    return encrypted.toString('base64');
}

export function decryptWithPrivateKey(privateKey: string, encryptedData: string): string {
    const buffer = Buffer.from(encryptedData, 'base64');
    const decrypted = crypto.privateDecrypt(privateKey, buffer);
    return decrypted.toString('utf8');
}


export function serializeDarkPoolTakerSwapMessage(message: DarkPoolTakerSwapMessage): string {
    return JSON.stringify({
        outNote: {
            rho: hexlify32(message.outNote.rho),
            amount: hexlify32(message.outNote.amount),
            asset: message.outNote.asset,
            note: hexlify32(message.outNote.note),
        },
        inNote: {
            rho: hexlify32(message.inNote.rho),
            amount: hexlify32(message.inNote.amount),
            asset: message.inNote.asset,
            note: hexlify32(message.inNote.note),
        },
        feeAsset: message.feeAsset,
        feeAmount: hexlify32(message.feeAmount),
        publicKey: message.publicKey,
        swapSignature: message.swapSignature
    });
}

export function deserializeDarkPoolTakerSwapMessage(serializedMessage: string): DarkPoolTakerSwapMessage {
    const message = JSON.parse(serializedMessage);
    return {
        outNote: {
            rho: BigInt(message.outNote.rho),
            amount: BigInt(message.outNote.amount),
            asset: message.outNote.asset,
            note: BigInt(message.outNote.note),
        },
        inNote: {
            rho: BigInt(message.inNote.rho),
            amount: BigInt(message.inNote.amount),
            asset: message.inNote.asset,
            note: BigInt(message.inNote.note),
        },
        feeAsset: message.feeAsset,
        feeAmount: BigInt(message.feeAmount),
        publicKey: message.publicKey,
        swapSignature: message.swapSignature
    }
}