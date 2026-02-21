import { describe, it, expect, beforeEach } from 'vitest'
import { fetch } from '@nuxt/test-utils/e2e'
import { prisma } from '@infrastructure/db/prisma'
import { createBcryptHasher } from '@infrastructure/security/password-hasher.bcrypt'

describe('Integration Tests — Analysis Core Flow', async () => {
  const hasher = createBcryptHasher(4)
  let sessionCookie = ''
  let userId = ''

  beforeEach(async () => {
    await prisma.rating.deleteMany({})
    await prisma.criterion.deleteMany({})
    await prisma.alternative.deleteMany({})
    await prisma.analysis.deleteMany({})
    await prisma.user.deleteMany({})

    const email = `flow-${Date.now()}@example.com`
    const password = 'FlowPassword123!'
    const user = await prisma.user.create({
      data: { email, passwordHash: await hasher.hash(password) }
    })
    userId = user.id

    const loginRes = await fetch('/api/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
      headers: { 'Content-Type': 'application/json' }
    })

    sessionCookie = loginRes.headers.get('set-cookie')?.split(';')[0] || ''
    expect(user.id).toBeDefined()
  })

  /* TC-IT-08 */
  it('should run the core analysis flow end-to-end', async () => {
    const createRes = await fetch('/api/analyses', {
      method: 'POST',
      body: JSON.stringify({
        title: 'Core Flow Analysis',
        description: 'Integration happy path'
      }),
      headers: {
        'Content-Type': 'application/json',
        'Cookie': sessionCookie
      }
    })

    expect(createRes.status).toBe(201)
    const created = await createRes.json()
    const analysisId = created.id
    expect(typeof analysisId).toBe('string')

    const dbAnalysis = await prisma.analysis.findUnique({
      where: { id: analysisId }
    })
    expect(dbAnalysis).not.toBeNull()
    expect(dbAnalysis?.title).toBe('Core Flow Analysis')
    expect(dbAnalysis?.description).toBe('Integration happy path')
    expect(dbAnalysis?.userId).toBe(userId)

    const alternativesRes = await fetch(`/api/analyses/${analysisId}/alternatives`, {
      method: 'POST',
      body: JSON.stringify({
        alternatives: [{ name: 'Option A' }, { name: 'Option B' }]
      }),
      headers: {
        'Content-Type': 'application/json',
        'Cookie': sessionCookie
      }
    })

    expect(alternativesRes.status).toBe(201)
    const alternativesBody = await alternativesRes.json()
    expect(alternativesBody.data).toHaveLength(2)
    const [altA, altB] = alternativesBody.data

    const dbAlternatives = await prisma.alternative.findMany({
      where: { analysisId },
      orderBy: { name: 'asc' }
    })
    expect(dbAlternatives).toHaveLength(2)
    expect(dbAlternatives.map(alt => alt.name)).toEqual(['Option A', 'Option B'])
    expect(dbAlternatives.map(alt => alt.id)).toEqual(
      expect.arrayContaining([altA.id, altB.id])
    )

    const criteriaRes = await fetch(`/api/analyses/${analysisId}/criteria`, {
      method: 'PUT',
      body: JSON.stringify({
        criteria: [
          { name: 'Cost', weight: 60 },
          { name: 'Quality', weight: 40 }
        ]
      }),
      headers: {
        'Content-Type': 'application/json',
        'Cookie': sessionCookie
      }
    })

    expect(criteriaRes.status).toBe(200)
    const criteriaBody = await criteriaRes.json()
    expect(criteriaBody.data).toHaveLength(2)
    const [critCost, critQuality] = criteriaBody.data

    const dbCriteria = await prisma.criterion.findMany({
      where: { analysisId },
      orderBy: { name: 'asc' }
    })
    expect(dbCriteria).toHaveLength(2)
    const criteriaByName = Object.fromEntries(
      dbCriteria.map(crit => [crit.name, crit.weight])
    )
    expect(criteriaByName).toMatchObject({ Cost: 60, Quality: 40 })
    expect(dbCriteria.map(crit => crit.id)).toEqual(
      expect.arrayContaining([critCost.id, critQuality.id])
    )

    const ratingsRes = await fetch(`/api/analyses/${analysisId}/ratings`, {
      method: 'PUT',
      body: JSON.stringify({
        ratings: [
          { alternativeId: altA.id, criterionId: critCost.id, value: 5 },
          { alternativeId: altA.id, criterionId: critQuality.id, value: 4 },
          { alternativeId: altB.id, criterionId: critCost.id, value: 3 },
          { alternativeId: altB.id, criterionId: critQuality.id, value: 2 }
        ]
      }),
      headers: {
        'Content-Type': 'application/json',
        'Cookie': sessionCookie
      }
    })

    expect(ratingsRes.status).toBe(200)
    const ratingsBody = await ratingsRes.json()
    expect(ratingsBody.data).toHaveLength(4)

    const dbRatings = await prisma.rating.findMany({
      where: {
        alternativeId: { in: [altA.id, altB.id] },
        criterionId: { in: [critCost.id, critQuality.id] }
      }
    })
    expect(dbRatings).toHaveLength(4)
    const ratingIndex = Object.fromEntries(
      dbRatings.map(rating => [
        `${rating.alternativeId}:${rating.criterionId}`,
        rating.value
      ])
    )
    expect(ratingIndex[`${altA.id}:${critCost.id}`]).toBe(5)
    expect(ratingIndex[`${altA.id}:${critQuality.id}`]).toBe(4)
    expect(ratingIndex[`${altB.id}:${critCost.id}`]).toBe(3)
    expect(ratingIndex[`${altB.id}:${critQuality.id}`]).toBe(2)

    const resultsRes = await fetch(`/api/analyses/${analysisId}/results`, {
      headers: {
        Cookie: sessionCookie
      }
    })

    expect(resultsRes.status).toBe(200)
    const resultsBody = await resultsRes.json()
    expect(resultsBody.weightSum).toBe(100)
    expect(resultsBody.results).toHaveLength(2)
    expect(resultsBody.results[0].rank).toBe(1)
    expect(resultsBody.results[1].rank).toBe(2)
    expect(resultsBody.results[0].alternativeId).toBe(altA.id)
  })
})
