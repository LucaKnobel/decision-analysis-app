import { describe, it, expect } from 'vitest'
import { UpdateCriteriaResponseSchema } from '../../server/api/schemas/criteria/update-criteria.response.schema'

describe('UpdateCriteriaResponseSchema', () => {
  it('accepts valid response', () => {
    const validInput = {
      data: [
        {
          id: '550e8400-e29b-41d4-a716-446655440000',
          analysisId: 'f47ac10b-58cc-4372-a567-0e02b2c3d479',
          name: 'Cost',
          weight: 50
        }
      ]
    }

    const result = UpdateCriteriaResponseSchema.safeParse(validInput)

    expect(result.success).toBe(true)
  })

  it('rejects invalid analysis uuid', () => {
    const invalidInput = {
      data: [
        {
          id: '550e8400-e29b-41d4-a716-446655440000',
          analysisId: 'not-a-uuid',
          name: 'Cost',
          weight: 50
        }
      ]
    }

    const result = UpdateCriteriaResponseSchema.safeParse(invalidInput)

    expect(result.success).toBe(false)
  })
})
