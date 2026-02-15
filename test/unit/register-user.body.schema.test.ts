import { describe, it, expect } from 'vitest'
import { RegisterUserBodySchema } from '../../server/api/schemas/auth/register-user.body.schema'

describe('RegisterUserBodySchema', () => {
  it('accepts valid registration data', () => {
    const result = RegisterUserBodySchema.safeParse({
      email: 'newuser@example.com',
      password: 'SecurePass123!'
    })

    expect(result.success).toBe(true)
  })

  it('lowercases email', () => {
    const result = RegisterUserBodySchema.safeParse({
      email: 'User@Example.COM',
      password: 'SecurePass123!'
    })

    expect(result.success).toBe(true)
    if (result.success) {
      expect(result.data.email).toBe('user@example.com')
    }
  })

  it('rejects invalid email', () => {
    const result = RegisterUserBodySchema.safeParse({
      email: 'not-an-email',
      password: 'SecurePass123!'
    })

    expect(result.success).toBe(false)
  })

  it('rejects password without uppercase letter', () => {
    const result = RegisterUserBodySchema.safeParse({
      email: 'user@example.com',
      password: 'lowercasepass123!'
    })

    expect(result.success).toBe(false)
  })

  it('rejects password shorter than 12 characters', () => {
    const result = RegisterUserBodySchema.safeParse({
      email: 'user@example.com',
      password: 'Short1!'
    })

    expect(result.success).toBe(false)
  })
})
