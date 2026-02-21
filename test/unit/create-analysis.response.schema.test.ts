// TC-ID: TC-UT-03
import { describe, it, expect } from 'vitest'
import { CreateAnalysisResponseSchema } from '../../server/api/schemas/analyses/create-analysis.response.schema'

describe('CreateAnalysisResponseSchema', () => {
  it('accepts a valid UUID', () => {
    const validInput = {
      id: '123e4567-e89b-12d3-a456-426614174000'
    }

    const result = CreateAnalysisResponseSchema.safeParse(validInput)

    expect(result.success).toBe(true)
  })

  it('rejects an invalid UUID', () => {
    const invalidInput = {
      id: 'not-a-uuid'
    }

    const result = CreateAnalysisResponseSchema.safeParse(invalidInput)

    expect(result.success).toBe(false)
  })
})
