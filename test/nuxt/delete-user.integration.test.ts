import { describe, it, expect, beforeEach } from 'vitest'
import { fetch } from '@nuxt/test-utils/e2e'
import { prisma } from '@infrastructure/db/prisma'
import { createBcryptHasher } from '@infrastructure/security/password-hasher.bcrypt'

describe('Integration Tests — Delete User /api/auth/account', async () => {
  const hasher = createBcryptHasher(4)
  let sessionCookie = ''
  let userId = ''

  beforeEach(async () => {
    await prisma.rating.deleteMany({})
    await prisma.criterion.deleteMany({})
    await prisma.alternative.deleteMany({})
    await prisma.analysis.deleteMany({})
    await prisma.user.deleteMany({})

    const email = `delete-${Date.now()}@example.com`
    const password = 'DeletePassword123!'
    const user = await prisma.user.create({
      data: { email, passwordHash: await hasher.hash(password) }
    })
    userId = user.id

    await prisma.analysis.create({
      data: { title: 'Delete Me', userId }
    })

    const loginRes = await fetch('/api/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
      headers: { 'Content-Type': 'application/json' }
    })

    sessionCookie = loginRes.headers.get('set-cookie')?.split(';')[0] || ''
  })

  it('should delete the user account and related data (204)', async () => {
    const res = await fetch('/api/auth/account', {
      method: 'DELETE',
      headers: { Cookie: sessionCookie }
    })

    expect(res.status).toBe(204)
    expect(await prisma.user.findUnique({ where: { id: userId } })).toBeNull()
    expect(await prisma.analysis.count({ where: { userId } })).toBe(0)
  })
})
