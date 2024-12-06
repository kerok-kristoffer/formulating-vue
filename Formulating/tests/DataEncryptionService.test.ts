import { DataEncryptionService } from '../src/types/DataEncryptionService'
import { EncryptionPreferenceService } from '../src/types/EncryptionPreferenceService'
import { EncryptionService } from '../src/types/EncryptionService'

describe('DataEncryptionService', () => {
  const validKey = 'thisisaverysecurekey1234'
  const data = 'Sensitive data'
  const encryptionService = new EncryptionService()
  const encryptionPreferenceService = new EncryptionPreferenceService(true, validKey)

  it('should encrypt and decrypt data correctly', () => {
    const service = new DataEncryptionService(encryptionService, encryptionPreferenceService)
    const encryptedData = service.encryptData(data)
    const decryptedData = service.decryptData(encryptedData)
    expect(decryptedData).toBe(data)
  })

  it('should not decrypt data with a different key', () => {
    const service = new DataEncryptionService(encryptionService, encryptionPreferenceService)
    const encryptedData = service.encryptData(data)
    const anotherEncryptionPreferenceService = new EncryptionPreferenceService(
      true,
      'anothersecurekey1234'
    )
    const differentKeyService = new DataEncryptionService(
      encryptionService,
      anotherEncryptionPreferenceService
    )
    const decryptedData = differentKeyService.decryptData(encryptedData)
    expect(decryptedData).not.toBe(data)
  })
})
