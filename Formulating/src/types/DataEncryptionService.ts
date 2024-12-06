import * as CryptoJS from 'crypto-js';
import {EncryptionPreferenceService} from "./EncryptionPreferenceService";
import {EncryptionService} from "./EncryptionService";
import {NonceGenerator} from "./NonceGenerator";

export class DataEncryptionService {
    private encryptionService: EncryptionService;
    private preferenceService: EncryptionPreferenceService;

    constructor(encryptionService: EncryptionService, preferenceService: EncryptionPreferenceService) {

        this.encryptionService = encryptionService;
        this.preferenceService = preferenceService;
    }

    encryptData(data: string): string {
        if (this.preferenceService.shouldEncrypt()) {
            const nonce = NonceGenerator.generateNonce();
            const encryptedData = this.encryptionService.encrypt(data, this.preferenceService.getUserKey(), nonce);
            return encryptedData + nonce;
        }
        return data;
    }

    decryptData(data: string): string {
        if (this.preferenceService.shouldEncrypt() && data.startsWith('U2FsdGVkX1')) {
            const nonce = data.slice(-32); // Assuming nonce length is 24 characters
            const ciphertext = data.slice(0, -32);
            return this.encryptionService.decrypt(ciphertext, this.preferenceService.getUserKey(), nonce);
        }
        return data;
    }
}