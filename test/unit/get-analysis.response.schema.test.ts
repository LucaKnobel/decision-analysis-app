import { describe, it, expect } from 'vitest'
import { GetAnalysisResponseSchema } from '../../server/api/schemas/analyses/get-analysis.response.schema'

describe('GetAnalysisResponseSchema', () => {
  it('accepts a valid response', () => {
    const validInput = {
      id: '550e8400-e29b-41d4-a716-446655440000',
      title: 'Analysis title',
      description: null,
      createdAt: '2026-01-15T10:30:00Z',
      updatedAt: '2026-01-20T14:45:00Z'
    }

    const result = GetAnalysisResponseSchema.safeParse(validInput)

    expect(result.success).toBe(true)
  })

  it('rejects invalid uuid', () => {
    const invalidInput = {
      id: 'not-a-uuid',
      title: 'Analysis title',
      description: null,
      createdAt: '2026-01-15T10:30:00Z',
      updatedAt: '2026-01-20T14:45:00Z'
    }

    const result = GetAnalysisResponseSchema.safeParse(invalidInput)

    expect(result.success).toBe(false)
  })

  it('rejects missing required fields', () => {
    const invalidInput = {
      id: '550e8400-e29b-41d4-a716-446655440000'
    }

    const result = GetAnalysisResponseSchema.safeParse(invalidInput)

    expect(result.success).toBe(false)
  })
})
