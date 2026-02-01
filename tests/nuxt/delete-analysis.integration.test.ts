import { describe, it, expect, beforeEach } from 'vitest'
import { setup, fetch } from '@nuxt/test-utils/e2e'
import { prisma } from '@infrastructure/db/prisma'
import { createBcryptHasher } from '@infrastructure/security/password-hasher.bcrypt'

describe('Integration Tests — Delete Analysis DELETE /api/analyses/:id', async () => {
  await setup({ server: true })

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

  it('should delete own analysis (204)', async () => {
    const analysis = await prisma.analysis.create({
      data: { title: 'To Delete', userId: testUserId }
    })

    const res = await fetch(`/api/analyses/${analysis.id}`, {
      method: 'DELETE',
      headers: { Cookie: sessionCookie }
    })

    expect(res.status).toBe(204)
    expect(await prisma.analysis.findUnique({ where: { id: analysis.id } })).toBeNull()
  })

  it('should reject without authentication (401)', async () => {
    const analysis = await prisma.analysis.create({
      data: { title: 'Protected', userId: testUserId }
    })

    const res = await fetch(`/api/analyses/${analysis.id}`, {
      method: 'DELETE'
    })

    expect(res.status).toBe(401)
    expect(await prisma.analysis.findUnique({ where: { id: analysis.id } })).not.toBeNull()
  })

  it('should return 404 for non-existent analysis', async () => {
    const res = await fetch('/api/analyses/550e8400-e29b-41d4-a716-446655440000', {
      method: 'DELETE',
      headers: { Cookie: sessionCookie }
    })

    expect(res.status).toBe(404)
  })

  it('should return 404 when deleting another users analysis', async () => {
    const otherUser = await prisma.user.create({
      data: { email: 'other@example.com', passwordHash: await hasher.hash('pass') }
    })
    const analysis = await prisma.analysis.create({
      data: { title: 'Other User Analysis', userId: otherUser.id }
    })

    const res = await fetch(`/api/analyses/${analysis.id}`, {
      method: 'DELETE',
      headers: { Cookie: sessionCookie }
    })

    expect(res.status).toBe(404)
    expect(await prisma.analysis.findUnique({ where: { id: analysis.id } })).not.toBeNull()
  })
})
