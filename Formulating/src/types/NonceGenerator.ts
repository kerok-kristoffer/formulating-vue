import * as CryptoJS from "crypto-js";

export class NonceGenerator {
    private static nonce: string;

    public static generateNonce(): string {
        return CryptoJS.lib.WordArray.random(16).toString();
    }
}