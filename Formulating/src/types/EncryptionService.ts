import * as CryptoJS from 'crypto-js';

export class EncryptionService {
    private key: string;

    constructor(key: string) {
        this.key = key;
    }

    encrypt(text: string): string {
        return CryptoJS.AES.encrypt(text, this.key).toString();
    }

    decrypt(ciphertext: string): string {
        const bytes = CryptoJS.AES.decrypt(ciphertext, this.key);
        return bytes.toString(CryptoJS.enc.Utf8);
    }
}