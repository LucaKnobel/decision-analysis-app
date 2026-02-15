import { describe, it, expect } from 'vitest'
import { GetAlternativesResponseSchema } from '../../server/api/schemas/alternatives/get-alternatives.response.schema'

describe('GetAlternativesResponseSchema', () => {
  it('accepts valid response', () => {
    const validInput = {
      data: [
        {
          id: '550e8400-e29b-41d4-a716-446655440000',
          analysisId: 'f47ac10b-58cc-4372-a567-0e02b2c3d479',
          name: 'Option A'
        }
      ]
    }

    const result = GetAlternativesResponseSchema.safeParse(validInput)

    expect(result.success).toBe(true)
  })

  it('rejects missing data field', () => {
    const invalidInput = {}

    const result = GetAlternativesResponseSchema.safeParse(invalidInput)

    expect(result.success).toBe(false)
  })
})
