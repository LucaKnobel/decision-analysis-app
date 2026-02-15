import { describe, it, expect } from 'vitest'
import { LoginUserBodySchema } from '../../server/api/schemas/auth/login-user.body.schema'

describe('LoginUserBodySchema', () => {
  it('accepts valid login data', () => {
    const result = LoginUserBodySchema.safeParse({
      email: 'test@example.com',
      password: 'ValidPassword123!'
    })

    expect(result.success).toBe(true)
  })

  it('lowercases email', () => {
    const result = LoginUserBodySchema.safeParse({
      email: 'User@Example.COM',
      password: 'ValidPassword123!'
    })

    expect(result.success).toBe(true)
    if (result.success) {
      expect(result.data.email).toBe('user@example.com')
    }
  })

  it('rejects invalid email', () => {
    const result = LoginUserBodySchema.safeParse({
      email: 'not-an-email',
      password: 'ValidPassword123!'
    })

    expect(result.success).toBe(false)
  })

  it('rejects password shorter than 12 characters', () => {
    const result = LoginUserBodySchema.safeParse({
      email: 'test@example.com',
      password: 'Short1!'
    })

    expect(result.success).toBe(false)
  })

  it('rejects password longer than 256 characters', () => {
    const result = LoginUserBodySchema.safeParse({
      email: 'test@example.com',
      password: 'A'.repeat(257)
    })

    expect(result.success).toBe(false)
  })
})
