export class EncryptionPreferenceService {
    private readonly useEncryption: boolean;
    private readonly userKey: string;

    constructor(useEncryption: boolean, userKey: string) {
        if (useEncryption && (!userKey || userKey.length < 8)) {
            throw new Error('Invalid user key');
        }
        this.useEncryption = useEncryption;
        this.userKey = userKey;
    }

    shouldEncrypt(): boolean {
        return this.useEncryption;
    }

    getUserKey(): string {
        return this.userKey;
    }
}