import { EncryptionPreferenceService } from '../src/types/EncryptionPreferenceService'

describe('EncryptionPreferenceService', () => {
  const validKey = 'validUserKey12345';
  it('should return true if encryption is enabled', () => {
    const service = new EncryptionPreferenceService(true, validKey)
    expect(service.shouldEncrypt()).toBe(true)
  })

  it('should return false if encryption is disabled', () => {
    const service = new EncryptionPreferenceService(false, validKey)
    expect(service.shouldEncrypt()).toBe(false)
  })

  it('should return the correct user key', () => {
    const service = new EncryptionPreferenceService(true, validKey)
    expect(service.getUserKey()).toBe(validKey)
  })

  it('should throw an error if encryption is enabled but user key is invalid', () => {
    expect(() => new EncryptionPreferenceService(true, '')).toThrowError('Invalid user key')
  })

  it('should allow an empty user key if encryption is disabled', () => {
    const service = new EncryptionPreferenceService(false, '')
    expect(service.getUserKey()).toBe('')
  })

  it('should serialize to a JSON object', () => {
    const service = new EncryptionPreferenceService(true, validKey)
    const json = service.toJSON()
    expect(json).toEqual({ useEncryption: true, userKey: validKey })
  })

  it('should deserialize from a JSON object', () => {
    const json = { useEncryption: true, userKey: validKey }
    const service = EncryptionPreferenceService.fromJSON(json)
    expect(service.shouldEncrypt()).toBe(true)
    expect(service.getUserKey()).toBe(validKey)
  })
})
