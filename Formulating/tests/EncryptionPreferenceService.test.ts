import { EncryptionPreferenceService } from '../src/types/EncryptionPreferenceService';

describe('EncryptionPreferenceService', () => {
    it('should return true if encryption is enabled', () => {
        const service = new EncryptionPreferenceService(true, 'user-key');
        expect(service.shouldEncrypt()).toBe(true);
    });

    it('should return false if encryption is disabled', () => {
        const service = new EncryptionPreferenceService(false, 'user-key');
        expect(service.shouldEncrypt()).toBe(false);
    });

    it('should return the correct user key', () => {
        const key = 'user-key';
        const service = new EncryptionPreferenceService(true, key);
        expect(service.getUserKey()).toBe(key);
    });

    it('should throw an error if encryption is enabled but user key is invalid', () => {
        expect(() => new EncryptionPreferenceService(true, '')).toThrowError('Invalid user key');
    });

    it('should allow an empty user key if encryption is disabled', () => {
        const service = new EncryptionPreferenceService(false, '');
        expect(service.getUserKey()).toBe('');
    });
});