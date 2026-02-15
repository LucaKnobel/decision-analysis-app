import { describe, it, expect, beforeEach } from 'vitest'
import { fetch } from '@nuxt/test-utils/e2e'
import { prisma } from '@infrastructure/db/prisma'
import { createBcryptHasher } from '@infrastructure/security/password-hasher.bcrypt'

describe('Integration Tests — User Login /api/auth/login', async () => {
  const hasher = createBcryptHasher(4)

  beforeEach(async () => {
    await prisma.user.deleteMany({})
  })

  it('should successfully login with valid credentials (204)', async () => {
    const email = `testuser-${Date.now()}@example.com`
    const password = 'SecurePassword123!'
    const passwordHash = await hasher.hash(password)
    await prisma.user.create({
      data: {
        email,
        passwordHash
      }
    })

    const res = await fetch('/api/auth/login', {
      method: 'POST',
      body: JSON.stringify({
        email,
        password
      }),
      headers: {
        'Content-Type': 'application/json'
      }
    })

    expect(res.status).toBe(204)
    const setCookie = res.headers.get('set-cookie')
    expect(setCookie).toBeDefined()
    expect(setCookie).not.toBeNull()
    expect(setCookie).toContain('nuxt-session=')
    expect(setCookie).toContain('HttpOnly')
    expect(setCookie).toContain('Path=/')
    expect(setCookie).toContain('Secure')
    expect(setCookie).toContain('SameSite=Lax')
  })

  it('should reject login with incorrect password (401)', async () => {
    const email = `testuser-${Date.now()}@example.com`
    const passwordHash = await hasher.hash('CorrectPassword123!')
    await prisma.user.create({
      data: {
        email,
        passwordHash
      }
    })

    const res = await fetch('/api/auth/login', {
      method: 'POST',
      body: JSON.stringify({
        email,
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
        email: `nonexistent-${Date.now()}@example.com`,
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
