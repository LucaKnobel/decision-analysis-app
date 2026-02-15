import { describe, it, expect } from 'vitest'
import { CreateAlternativesResponseSchema } from '../../server/api/schemas/alternatives/create-alternatives.response.schema'

describe('CreateAlternativesResponseSchema', () => {
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

    const result = CreateAlternativesResponseSchema.safeParse(validInput)

    expect(result.success).toBe(true)
  })

  it('rejects invalid uuid', () => {
    const invalidInput = {
      data: [
        {
          id: 'not-a-uuid',
          analysisId: 'f47ac10b-58cc-4372-a567-0e02b2c3d479',
          name: 'Option A'
        }
      ]
    }

    const result = CreateAlternativesResponseSchema.safeParse(invalidInput)

    expect(result.success).toBe(false)
  })
})
