import {NonceGenerator} from "../src/types/NonceGenerator";


describe('NonceGenerator', () => {
    it('should return a nonce of 16 characters', () => {
        const nonce = NonceGenerator.generateNonce();
        expect(nonce.length).toBe(32);
    });

    it('should return different nonces for different calls', () => {
        const nonce1 = NonceGenerator.generateNonce();
        const nonce2 = NonceGenerator.generateNonce();
        expect(nonce1).not.toBe(nonce2);
    });
})