// TC-ID: TC-UT-04
import { describe, it, expect } from 'vitest'
import { GetCriteriaResponseSchema } from '../../server/api/schemas/criteria/get-criteria.response.schema'

describe('GetCriteriaResponseSchema', () => {
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

    const result = GetCriteriaResponseSchema.safeParse(validInput)

    expect(result.success).toBe(true)
  })

  it('rejects non-number weight', () => {
    const invalidInput = {
      data: [
        {
          id: '550e8400-e29b-41d4-a716-446655440000',
          analysisId: 'f47ac10b-58cc-4372-a567-0e02b2c3d479',
          name: 'Cost',
          weight: '50'
        }
      ]
    }

    const result = GetCriteriaResponseSchema.safeParse(invalidInput)

    expect(result.success).toBe(false)
  })
})
