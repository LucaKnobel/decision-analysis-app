import { describe, it, expect } from 'vitest'
import { GetAnalysesResponseSchema } from '../../server/api/schemas/analyses/get-analyses.response.schema'

describe('GetAnalysesResponseSchema', () => {
  const validAnalysisItem = {
    id: '550e8400-e29b-41d4-a716-446655440000',
    title: 'Test Analysis',
    description: null,
    createdAt: '2026-01-15T10:30:00Z',
    updatedAt: '2026-01-20T14:45:00Z'
  }

  const validPagination = {
    page: 1,
    limit: 20,
    total: 100,
    totalPages: 5
  }

  it('accepts valid response', () => {
    const validInput = {
      data: [validAnalysisItem],
      pagination: validPagination
    }

    const result = GetAnalysesResponseSchema.safeParse(validInput)

    expect(result.success).toBe(true)
  })

  it('rejects invalid UUID in items', () => {
    const invalidInput = {
      data: [{ ...validAnalysisItem, id: 'not-a-uuid' }],
      pagination: validPagination
    }

    const result = GetAnalysesResponseSchema.safeParse(invalidInput)

    expect(result.success).toBe(false)
  })

  it('rejects pagination limit greater than 100', () => {
    const invalidInput = {
      data: [],
      pagination: { ...validPagination, limit: 101 }
    }

    const result = GetAnalysesResponseSchema.safeParse(invalidInput)

    expect(result.success).toBe(false)
  })
})
