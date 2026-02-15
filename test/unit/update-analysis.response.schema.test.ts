import { describe, it, expect } from 'vitest'
import { UpdateAnalysisResponseSchema } from '../../server/api/schemas/analyses/update-analysis.response.schema'

describe('UpdateAnalysisResponseSchema', () => {
  it('accepts a valid response', () => {
    const validInput = {
      id: '550e8400-e29b-41d4-a716-446655440000',
      title: 'Updated analysis',
      description: 'Updated description',
      createdAt: '2026-01-15T10:30:00Z',
      updatedAt: '2026-01-20T14:45:00Z'
    }

    const result = UpdateAnalysisResponseSchema.safeParse(validInput)

    expect(result.success).toBe(true)
  })

  it('rejects invalid uuid', () => {
    const invalidInput = {
      id: 'not-a-uuid',
      title: 'Updated analysis',
      description: null,
      createdAt: '2026-01-15T10:30:00Z',
      updatedAt: '2026-01-20T14:45:00Z'
    }

    const result = UpdateAnalysisResponseSchema.safeParse(invalidInput)

    expect(result.success).toBe(false)
  })
})
