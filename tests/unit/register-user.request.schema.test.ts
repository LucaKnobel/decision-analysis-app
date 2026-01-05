import { describe, it, expect } from 'vitest'
import { RegisterUserRequestSchema } from '../../server/api/schemas/auth/register-user.request.schema'
/* TC-UT-02 & TC-UT-03 */
describe('RegisterUserRequestSchema', () => {
  describe('email validation', () => {
    it('should accept valid email addresses', () => {
      const validEmails = [
        'user@example.com',
        'test.user@example.co.uk',
        'user+tag@example.com',
        'User@Example.COM'
      ]

      validEmails.forEach((email) => {
        const result = RegisterUserRequestSchema.safeParse({
          email,
          password: 'ValidPass123!'
        })
        expect(result.success).toBe(true)
      })
    })

    it('should convert email to lowercase', () => {
      const result = RegisterUserRequestSchema.parse({
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
        const result = RegisterUserRequestSchema.safeParse({
          email,
          password: 'ValidPass123!'
        })
        expect(result.success).toBe(false)
      })
    })
  })

  /* TC-UT-01 */
  describe('password validation', () => {
    it('should accept valid passwords', () => {
      const validPasswords = [
        'ValidPass123!',
        'Abcdefgh1234!@#$',
        'MyP@ssw0rd123'
      ]

      validPasswords.forEach((password) => {
        const result = RegisterUserRequestSchema.safeParse({
          email: 'user@example.com',
          password
        })
        expect(result.success).toBe(true)
      })
    })

    it('should reject passwords shorter than 12 characters', () => {
      const result = RegisterUserRequestSchema.safeParse({
        email: 'user@example.com',
        password: 'Short1!'
      })
      expect(result.success).toBe(false)
      if (!result.success) {
        expect(result.error.issues[0].message).toBe('Password must be at least 12 characters')
      }
    })

    it('should reject passwords longer than 256 characters', () => {
      const result = RegisterUserRequestSchema.safeParse({
        email: 'user@example.com',
        password: 'A'.repeat(257) + 'a1!'
      })
      expect(result.success).toBe(false)
      if (!result.success) {
        expect(result.error.issues[0].message).toBe('Password must not exceed 256 characters')
      }
    })

    it('should reject passwords without uppercase letters', () => {
      const result = RegisterUserRequestSchema.safeParse({
        email: 'user@example.com',
        password: 'lowercasepass123!'
      })
      expect(result.success).toBe(false)
      if (!result.success) {
        expect(result.error.issues[0].message).toBe('Password must contain at least one uppercase letter')
      }
    })

    it('should reject passwords without lowercase letters', () => {
      const result = RegisterUserRequestSchema.safeParse({
        email: 'user@example.com',
        password: 'UPPERCASEPASS123!'
      })
      expect(result.success).toBe(false)
      if (!result.success) {
        expect(result.error.issues[0].message).toBe('Password must contain at least one lowercase letter')
      }
    })

    it('should reject passwords without numbers', () => {
      const result = RegisterUserRequestSchema.safeParse({
        email: 'user@example.com',
        password: 'NoNumbersHere!'
      })
      expect(result.success).toBe(false)
      if (!result.success) {
        expect(result.error.issues[0].message).toBe('Password must contain at least one number')
      }
    })

    it('should reject passwords without special characters', () => {
      const result = RegisterUserRequestSchema.safeParse({
        email: 'user@example.com',
        password: 'NoSpecialChars123'
      })
      expect(result.success).toBe(false)
      if (!result.success) {
        expect(result.error.issues[0].message).toBe('Password must contain at least one special character')
      }
    })
  })
  /* TC-UT-01, TC-UT-02, TC-UT-03 */
  describe('complete validation', () => {
    it('should accept valid registration data', () => {
      const result = RegisterUserRequestSchema.safeParse({
        email: 'newuser@example.com',
        password: 'SecurePass123!'
      })
      expect(result.success).toBe(true)
      if (result.success) {
        expect(result.data).toEqual({
          email: 'newuser@example.com',
          password: 'SecurePass123!'
        })
      }
    })

    it('should reject when both fields are invalid', () => {
      const result = RegisterUserRequestSchema.safeParse({
        email: 'invalidemail',
        password: 'short'
      })
      expect(result.success).toBe(false)
      if (!result.success) {
        expect(result.error.issues.length).toBeGreaterThan(1)
      }
    })
  })
})
