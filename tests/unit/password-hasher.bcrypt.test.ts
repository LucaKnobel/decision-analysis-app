import { describe, it, expect } from 'vitest'
import { createBcryptHasher } from '../../server/infrastructure/security/password-hasher.bcrypt'

describe('BcryptPasswordHasher', () => {
  const hasher = createBcryptHasher(10) // Lower rounds for faster tests
  /* TC-UT-04 */
  describe('hash', () => {
    it('should hash a password', async () => {
      const password = 'MySecurePassword123!'
      const hash = await hasher.hash(password)

      expect(hash).toBeDefined()
      expect(hash).not.toBe(password)
      expect(hash).toMatch(/^\$2[aby]\$\d{2}\$.{53}$/) // bcrypt hash pattern
    })

    it('should generate different hashes for the same password', async () => {
      const password = 'SamePassword123!'
      const hash1 = await hasher.hash(password)
      const hash2 = await hasher.hash(password)

      expect(hash1).not.toBe(hash2) // Different salts
    })

    it('should handle empty strings', async () => {
      const hash = await hasher.hash('')
      expect(hash).toBeDefined()
      expect(hash).toMatch(/^\$2[aby]\$\d{2}\$.{53}$/)
    })

    it('should handle special characters', async () => {
      const password = '!@#$%^&*()_+-=[]{}|;:,.<>?'
      const hash = await hasher.hash(password)
      expect(hash).toBeDefined()
    })

    it('should handle unicode characters', async () => {
      const password = 'Пароль🔐密码'
      const hash = await hasher.hash(password)
      expect(hash).toBeDefined()
    })
  })

  /* TC-UT-05 */
  describe('verify', () => {
    it('should verify a correct password', async () => {
      const password = 'CorrectPassword123!'
      const hash = await hasher.hash(password)
      const isValid = await hasher.verify(password, hash)

      expect(isValid).toBe(true)
    })

    it('should reject an incorrect password', async () => {
      const password = 'CorrectPassword123!'
      const wrongPassword = 'WrongPassword123!'
      const hash = await hasher.hash(password)
      const isValid = await hasher.verify(wrongPassword, hash)

      expect(isValid).toBe(false)
    })

    it('should reject password with different casing', async () => {
      const password = 'CaseSensitive123!'
      const hash = await hasher.hash(password)
      const isValid = await hasher.verify('casesensitive123!', hash)

      expect(isValid).toBe(false)
    })

    it('should verify empty string if it was hashed', async () => {
      const password = ''
      const hash = await hasher.hash(password)
      const isValid = await hasher.verify(password, hash)

      expect(isValid).toBe(true)
    })

    it('should reject empty password against non-empty hash', async () => {
      const password = 'NotEmpty123!'
      const hash = await hasher.hash(password)
      const isValid = await hasher.verify('', hash)

      expect(isValid).toBe(false)
    })

    it('should handle unicode passwords correctly', async () => {
      const password = 'Пароль🔐密码123!'
      const hash = await hasher.hash(password)
      const isValid = await hasher.verify(password, hash)

      expect(isValid).toBe(true)
    })

    it('should reject tampered hash', async () => {
      const password = 'MyPassword123!'
      const hash = await hasher.hash(password)
      const tamperedHash = hash.slice(0, -1) + 'X'
      const isValid = await hasher.verify(password, tamperedHash)

      expect(isValid).toBe(false)
    })
  })

  /* TC-UT-04 */
  describe('salt rounds', () => {
    it('should use custom salt rounds', async () => {
      const customHasher = createBcryptHasher(4)
      const password = 'TestPassword123!'
      const hash = await customHasher.hash(password)

      // bcrypt hash format: $2a$04$... (04 = salt rounds)
      expect(hash).toMatch(/^\$2[aby]\$04\$/)
    })

    it('should default to 12 salt rounds if not specified', async () => {
      const defaultHasher = createBcryptHasher()
      const password = 'TestPassword123!'
      const hash = await defaultHasher.hash(password)

      // bcrypt hash format: $2a$12$... (12 = salt rounds)
      expect(hash).toMatch(/^\$2[aby]\$12\$/)
    })
  })
})
