import { describe, it, expect } from 'vitest'
import { LoginUserRequestSchema } from '../../server/api/schemas/auth/login-user.request.schema'

describe('LoginUserRequestSchema', () => {
  describe('email validation', () => {
    it('should accept valid email addresses', () => {
      const validEmails = [
        'user@example.com',
        'test.user@example.co.uk',
        'user+tag@example.com',
        'User@Example.COM'
      ]

      validEmails.forEach((email) => {
        const result = LoginUserRequestSchema.safeParse({
          email,
          password: 'ValidPass123!'
        })
        expect(result.success).toBe(true)
      })
    })

    it('should convert email to lowercase', () => {
      const result = LoginUserRequestSchema.parse({
        email: 'User@Example.COM',
        password: 'ValidPass123!'
      })
      expect(result.email).toBe('user@example.com')
    })

    it('should reject invalid email addresses', () => {
      const invalidEmails = [
        'notanemail',
        '@example.com',
        'user@',
        'user @example.com',
        '',
        'user@gmail..com',
        'user@gmail'
      ]

      invalidEmails.forEach((email) => {
        const result = LoginUserRequestSchema.safeParse({
          email,
          password: 'ValidPass123!'
        })
        expect(result.success).toBe(false)
      })
    })

    it('should trim whitespace from email', () => {
      const result = LoginUserRequestSchema.parse({
        email: '  test@example.com  ',
        password: 'ValidPass123!'
      })
      expect(result.email).toBe('test@example.com')
    })
  })

  describe('password validation', () => {
    it('should accept valid passwords', () => {
      const validPasswords = [
        'ValidPass123!',
        'Abcdefgh1234!@#$',
        'MyP@ssw0rd123',
        'A'.repeat(256) // Max length
      ]

      validPasswords.forEach((password) => {
        const result = LoginUserRequestSchema.safeParse({
          email: 'user@example.com',
          password
        })
        expect(result.success).toBe(true)
      })
    })

    it('should reject passwords shorter than 12 characters', () => {
      const result = LoginUserRequestSchema.safeParse({
        email: 'user@example.com',
        password: 'Short1!'
      })
      expect(result.success).toBe(false)
      if (!result.success) {
        expect(result.error.issues[0].message).toBe('Password must be at least 12 characters')
      }
    })

    it('should reject passwords longer than 256 characters', () => {
      const result = LoginUserRequestSchema.safeParse({
        email: 'user@example.com',
        password: 'A'.repeat(257)
      })
      expect(result.success).toBe(false)
      if (!result.success) {
        expect(result.error.issues[0].message).toBe('Password must not exceed 256 characters')
      }
    })

    it('should accept passwords with special characters', () => {
      const result = LoginUserRequestSchema.safeParse({
        email: 'user@example.com',
        password: '!@#$%^&*()_+-=[]{}|;:,.<>?ABC123abc'
      })
      expect(result.success).toBe(true)
    })

    it('should accept passwords with unicode characters', () => {
      const result = LoginUserRequestSchema.safeParse({
        email: 'user@example.com',
        password: 'MyПароль🔐密码123!' // Has Latin characters
      })
      expect(result.success).toBe(true)
    })
  })

  describe('complete schema validation', () => {
    it('should validate both email and password together', () => {
      const result = LoginUserRequestSchema.safeParse({
        email: 'test@example.com',
        password: 'ValidPassword123!'
      })
      expect(result.success).toBe(true)
      if (result.success) {
        expect(result.data).toEqual({
          email: 'test@example.com',
          password: 'ValidPassword123!'
        })
      }
    })

    it('should reject missing email', () => {
      const result = LoginUserRequestSchema.safeParse({
        password: 'ValidPassword123!'
      })
      expect(result.success).toBe(false)
    })

    it('should reject missing password', () => {
      const result = LoginUserRequestSchema.safeParse({
        email: 'test@example.com'
      })
      expect(result.success).toBe(false)
    })

    it('should reject empty object', () => {
      const result = LoginUserRequestSchema.safeParse({})
      expect(result.success).toBe(false)
    })

    it('should strip extra fields (default Zod behavior)', () => {
      const result = LoginUserRequestSchema.safeParse({
        email: 'test@example.com',
        password: 'ValidPassword123!',
        extraField: 'should not be here'
      })
      expect(result.success).toBe(true)
      if (result.success) {
        expect(result.data.email).toBe('test@example.com')
        expect(result.data.password).toBe('ValidPassword123!')
        // Extra field should not be in parsed data
        expect('extraField' in result.data).toBe(false)
      }
    })
  })

  describe('edge cases', () => {
    it('should handle minimum valid password length (12 chars)', () => {
      const result = LoginUserRequestSchema.safeParse({
        email: 'test@example.com',
        password: '123456789012'
      })
      expect(result.success).toBe(true)
    })

    it('should handle maximum valid password length (256 chars)', () => {
      const result = LoginUserRequestSchema.safeParse({
        email: 'test@example.com',
        password: 'A'.repeat(256)
      })
      expect(result.success).toBe(true)
    })

    it('should handle email with subdomain', () => {
      const result = LoginUserRequestSchema.safeParse({
        email: 'user@mail.example.com',
        password: 'ValidPassword123!'
      })
      expect(result.success).toBe(true)
    })

    it('should handle email with plus addressing', () => {
      const result = LoginUserRequestSchema.safeParse({
        email: 'user+tag@example.com',
        password: 'ValidPassword123!'
      })
      expect(result.success).toBe(true)
      if (result.success) {
        expect(result.data.email).toBe('user+tag@example.com')
      }
    })
  })
})
