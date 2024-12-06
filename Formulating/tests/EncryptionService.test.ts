import { EncryptionService } from '../src/types/EncryptionService'
import { NonceGenerator } from '../src/types/NonceGenerator'

describe('EncryptionService', () => {
  const key = 'test-key'
  const service = new EncryptionService()
  const nonce = NonceGenerator.generateNonce()

  it('should encrypt and decrypt text correctly', () => {
    const text = 'Hello, World!'
    const encrypted = service.encrypt(text, key, nonce)
    const decrypted = service.decrypt(encrypted, key, nonce)
    expect(decrypted).toBe(text)
  })

  it('should return different encrypted text for different inputs', () => {
    const text1 = 'Hello, World!'
    const text2 = 'Goodbye, World!'
    const encrypted1 = service.encrypt(text1, key, nonce)
    const encrypted2 = service.encrypt(text2, key, nonce)
    expect(encrypted1).not.toBe(encrypted2)
  })
  // different keys should result in different encrypted text
  it('should return different encrypted text for different keys', () => {
    const key1 = 'key1'
    const key2 = 'key2'
    const service = new EncryptionService()
    const text = 'Hello, World!'
    const encrypted1 = service.encrypt(text, key1, nonce)
    const encrypted2 = service.encrypt(text, key2, nonce)
    expect(encrypted1).not.toBe(encrypted2)
  })
  // different nonces should result in different encrypted text
  it('should return different encrypted text for different nonces', () => {
    const nonce2 = NonceGenerator.generateNonce()
    const text = 'Hello, World!'
    const encrypted1 = service.encrypt(text, key, nonce)
    const encrypted2 = service.encrypt(text, key, nonce2)
    expect(encrypted1).not.toBe(encrypted2)
  })
})
