export class EncryptionPreferenceService {
    private readonly useEncryption: boolean;
    private readonly userKey: string;

    constructor(useEncryption: boolean, userKey: string) {
        if (useEncryption && (!userKey || userKey.length < 16)) {
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

    toJSON(): { useEncryption: boolean, userKey: string } {
        return {
            useEncryption: this.useEncryption,
            userKey: this.userKey
        };
    }

    static fromJSON(json: { useEncryption: boolean, userKey: string }): EncryptionPreferenceService {
        return new EncryptionPreferenceService(json.useEncryption, json.userKey);
    }
}