import { EncryptionService } from '../src/types/EncryptionService'

describe('EncryptionService', () => {
  const key = 'test-key'
  const service = new EncryptionService(key)

  it('should encrypt and decrypt text correctly', () => {
    const text = 'Hello, World!'
    const encrypted = service.encrypt(text)
    const decrypted = service.decrypt(encrypted)
    expect(decrypted).toBe(text)
  })

  it('should return different encrypted text for different inputs', () => {
    const text1 = 'Hello, World!'
    const text2 = 'Goodbye, World!'
    const encrypted1 = service.encrypt(text1)
    const encrypted2 = service.encrypt(text2)
    expect(encrypted1).not.toBe(encrypted2)
  })
  // different keys should result in different encrypted text
    it('should return different encrypted text for different keys', () => {
        const key1 = 'key1'
        const key2 = 'key2'
        const service1 = new EncryptionService(key1)
        const service2 = new EncryptionService(key2)
        const text = 'Hello, World!'
        const encrypted1 = service1.encrypt(text)
        const encrypted2 = service2.encrypt(text)
        expect(encrypted1).not.toBe(encrypted2)
    })
})
