import { describe, it, expect, beforeEach } from 'vitest'
import { setup, fetch } from '@nuxt/test-utils/e2e'
import { prisma } from '@infrastructure/db/prisma'
import { createBcryptHasher } from '@infrastructure/security/password-hasher.bcrypt'

describe('Integration Tests — User Login /api/auth/login', async () => {
  await setup({
    server: true
  })

  const hasher = createBcryptHasher(10)

  beforeEach(async () => {
    await prisma.user.deleteMany({})
  })

  it('should successfully login with valid credentials (204)', async () => {
    const password = 'SecurePassword123!'
    const passwordHash = await hasher.hash(password)
    await prisma.user.create({
      data: {
        email: 'testuser@example.com',
        passwordHash
      }
    })

    const res = await fetch('/api/auth/login', {
      method: 'POST',
      body: JSON.stringify({
        email: 'testuser@example.com',
        password
      }),
      headers: {
        'Content-Type': 'application/json'
      }
    })

    expect(res.status).toBe(204)
    expect(res.headers.get('set-cookie')).toContain('nuxt-session')
  })

  it('should reject login with incorrect password (401)', async () => {
    const passwordHash = await hasher.hash('CorrectPassword123!')
    await prisma.user.create({
      data: {
        email: 'testuser@example.com',
        passwordHash
      }
    })

    const res = await fetch('/api/auth/login', {
      method: 'POST',
      body: JSON.stringify({
        email: 'testuser@example.com',
        password: 'WrongPassword123!'
      }),
      headers: {
        'Content-Type': 'application/json'
      }
    })

    expect(res.status).toBe(401)
    expect(res.headers.get('set-cookie')).toBeNull()
  })

  it('should reject login with non-existent user (401)', async () => {
    const res = await fetch('/api/auth/login', {
      method: 'POST',
      body: JSON.stringify({
        email: 'nonexistent@example.com',
        password: 'AnyPassword123!'
      }),
      headers: {
        'Content-Type': 'application/json'
      }
    })

    expect(res.status).toBe(401)
    expect(res.headers.get('set-cookie')).toBeNull()
  })
})
