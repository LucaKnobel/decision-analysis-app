import { describe, it, expect, beforeEach } from 'vitest'
import { setup, fetch } from '@nuxt/test-utils/e2e'
import { prisma } from '@infrastructure/db/prisma'
import { createBcryptHasher } from '@infrastructure/security/password-hasher.bcrypt'

describe('Integration Tests — Create Analysis /api/analyses', async () => {
  await setup({
    server: true
  })

  const hasher = createBcryptHasher(4)
  let testUserId: string
  let sessionCookie: string

  beforeEach(async () => {
    await prisma.analysis.deleteMany({})
    await prisma.user.deleteMany({})

    const email = `testuser-${Date.now()}@example.com`
    const password = 'TestPassword123!'
    const passwordHash = await hasher.hash(password)

    const user = await prisma.user.create({
      data: {
        email,
        passwordHash
      }
    })
    testUserId = user.id

    // Login to get session cookie
    const loginRes = await fetch('/api/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
      headers: {
        'Content-Type': 'application/json'
      }
    })

    const setCookie = loginRes.headers.get('set-cookie')
    sessionCookie = setCookie?.split(';')[0] || ''
  })

  it('should successfully create an analysis with authenticated user (201)', async () => {
    const payload = {
      title: 'My First Analysis',
      description: 'Test description'
    }

    const res = await fetch('/api/analyses', {
      method: 'POST',
      body: JSON.stringify(payload),
      headers: {
        'Content-Type': 'application/json',
        'Cookie': sessionCookie
      }
    })

    expect(res.status).toBe(201)

    const responseBody = await res.json()
    expect(responseBody).toHaveProperty('id')
    expect(typeof responseBody.id).toBe('string')

    // Verify database entry
    const analysis = await prisma.analysis.findUnique({
      where: { id: responseBody.id }
    })

    expect(analysis).not.toBeNull()
    expect(analysis?.title).toBe(payload.title)
    expect(analysis?.description).toBe(payload.description)
    expect(analysis?.userId).toBe(testUserId)
  })

  it('should create analysis without description (201)', async () => {
    const payload = {
      title: 'Analysis Without Description'
    }

    const res = await fetch('/api/analyses', {
      method: 'POST',
      body: JSON.stringify(payload),
      headers: {
        'Content-Type': 'application/json',
        'Cookie': sessionCookie
      }
    })

    expect(res.status).toBe(201)

    const responseBody = await res.json()
    const analysis = await prisma.analysis.findUnique({
      where: { id: responseBody.id }
    })

    expect(analysis?.description).toBeNull()
  })

  it('should reject request without authentication (401)', async () => {
    const payload = {
      title: 'Unauthorized Analysis'
    }

    const res = await fetch('/api/analyses', {
      method: 'POST',
      body: JSON.stringify(payload),
      headers: {
        'Content-Type': 'application/json'
      }
    })

    expect(res.status).toBe(401)

    // Verify no analysis was created
    const count = await prisma.analysis.count()
    expect(count).toBe(0)
  })

  it('should reject request with invalid data (400)', async () => {
    const payload = {
      title: '' // Empty title should fail validation
    }

    const res = await fetch('/api/analyses', {
      method: 'POST',
      body: JSON.stringify(payload),
      headers: {
        'Content-Type': 'application/json',
        'Cookie': sessionCookie
      }
    })

    expect(res.status).toBe(400)

    // Verify no analysis was created
    const count = await prisma.analysis.count()
    expect(count).toBe(0)
  })
})
