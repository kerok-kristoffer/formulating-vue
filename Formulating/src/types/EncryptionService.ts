import * as CryptoJS from 'crypto-js';

export class EncryptionService {

    encrypt(text: string, key: string, nonce: string): string {
        return CryptoJS.AES.encrypt(text, key + nonce).toString();
    }

    decrypt(ciphertext: string, key: string, nonce: string): string {
        const bytes = CryptoJS.AES.decrypt(ciphertext, key + nonce);
        return bytes.toString(CryptoJS.enc.Utf8);
    }
}