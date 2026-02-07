import { describe, it, expect, beforeEach } from 'vitest'
import { fetch } from '@nuxt/test-utils/e2e'
import { prisma } from '@infrastructure/db/prisma'
import { createBcryptHasher } from '@infrastructure/security/password-hasher.bcrypt'

describe('Integration Tests — Get Analyses GET /api/analyses', async () => {
  const hasher = createBcryptHasher(4)
  let sessionCookie: string
  let testUserId: string

  beforeEach(async () => {
    await prisma.analysis.deleteMany({})
    await prisma.user.deleteMany({})

    const email = `testuser-${Date.now()}@example.com`
    const password = 'TestPassword123!'
    const user = await prisma.user.create({
      data: { email, passwordHash: await hasher.hash(password) }
    })
    testUserId = user.id

    const loginRes = await fetch('/api/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
      headers: { 'Content-Type': 'application/json' }
    })
    sessionCookie = loginRes.headers.get('set-cookie')?.split(';')[0] || ''
  })

  it('should return paginated analyses (200)', async () => {
    await prisma.analysis.createMany({
      data: [
        { title: 'Analysis 1', userId: testUserId },
        { title: 'Analysis 2', userId: testUserId }
      ]
    })

    const res = await fetch('/api/analyses', {
      headers: { Cookie: sessionCookie }
    })

    expect(res.status).toBe(200)
    const body = await res.json()
    expect(body.data).toHaveLength(2)
    expect(body.pagination).toMatchObject({ page: 1, limit: 20, total: 2 })
  })

  it('should return empty array when no analyses (200)', async () => {
    const res = await fetch('/api/analyses', {
      headers: { Cookie: sessionCookie }
    })

    expect(res.status).toBe(200)
    const body = await res.json()
    expect(body.data).toHaveLength(0)
    expect(body.pagination.total).toBe(0)
  })

  it('should reject without authentication (401)', async () => {
    const res = await fetch('/api/analyses')
    expect(res.status).toBe(401)
  })

  it('should only return own analyses', async () => {
    const otherUser = await prisma.user.create({
      data: { email: 'other@example.com', passwordHash: await hasher.hash('pass') }
    })
    await prisma.analysis.createMany({
      data: [
        { title: 'My Analysis', userId: testUserId },
        { title: 'Other Analysis', userId: otherUser.id }
      ]
    })

    const res = await fetch('/api/analyses', {
      headers: { Cookie: sessionCookie }
    })

    expect(res.status).toBe(200)
    const body = await res.json()
    expect(body.data).toHaveLength(1)
    expect(body.data[0].title).toBe('My Analysis')
  })
})
