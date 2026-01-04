import { describe, it, expect, beforeEach } from 'vitest'
import { setup, fetch } from '@nuxt/test-utils/e2e'
import { prisma } from '@infrastructure/db/prisma'

describe('Integration Tests — User Registration /api/auth/register', async () => {
  // Setup Nuxt test server
  await setup({
    server: true
  })

  beforeEach(async () => {
    // Clean up users table before each test
    await prisma.user.deleteMany({})
  })
  /* TC-IT-01 */
  it('should successfully register a new user (201)', async () => {
    const payload = {
      email: 'newuser@example.com',
      password: 'SecurePassword123!'
    }

    const res = await fetch('/api/auth/register', {
      method: 'POST',
      body: JSON.stringify(payload),
      headers: {
        'Content-Type': 'application/json'
      }
    })

    // Verify HTTP status
    expect(res.status).toBe(201)

    // Verify database entry was created
    const user = await prisma.user.findUnique({
      where: { email: payload.email }
    })
    expect(user).not.toBeNull()
    expect(user?.email).toBe(payload.email)

    // Verify password is hashed, not stored in plaintext
    expect(user?.passwordHash).not.toBe(payload.password)
    expect(user?.passwordHash).toMatch(/^\$2[aby]\$/)
  })

  /* TC-IT-02 */
  it('should reject registration with already registered email (400)', async () => {
    // Precondition: Create existing user
    await prisma.user.create({
      data: {
        email: 'it@example.com',
        passwordHash: '$2a$10$hashedPasswordExample'
      }
    })

    const payload = {
      email: 'it@example.com',
      password: 'TestPasswort!23'
    }

    const res = await fetch('/api/auth/register', {
      method: 'POST',
      body: JSON.stringify(payload),
      headers: {
        'Content-Type': 'application/json'
      }
    })

    // Verify HTTP status (400 to prevent information disclosure)
    expect(res.status).toBe(400)

    // Verify no additional user was created
    const userCount = await prisma.user.count({
      where: { email: payload.email }
    })
    expect(userCount).toBe(1)
  })

  /* TC-IT-03 */
  it('should reject registration with password below minimum length (400)', async () => {
    const payload = {
      email: 'shortpw@example.com',
      password: 'Short1!'
    }

    const res = await fetch('/api/auth/register', {
      method: 'POST',
      body: JSON.stringify(payload),
      headers: {
        'Content-Type': 'application/json'
      }
    })

    // Verify HTTP status
    expect(res.status).toBe(400)

    // Verify no user was created
    const user = await prisma.user.findUnique({
      where: { email: payload.email }
    })
    expect(user).toBeNull()
  })
})
