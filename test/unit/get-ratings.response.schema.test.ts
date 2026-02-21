// TC-ID: TC-UT-06
import { describe, it, expect } from 'vitest'
import { GetRatingsResponseSchema } from '../../server/api/schemas/ratings/get-ratings.response.schema'

describe('GetRatingsResponseSchema', () => {
  it('accepts valid response', () => {
    const validInput = {
      alternatives: [
        {
          id: '550e8400-e29b-41d4-a716-446655440000',
          analysisId: 'f47ac10b-58cc-4372-a567-0e02b2c3d479',
          name: 'Option A'
        }
      ],
      criteria: [
        {
          id: '2c1b6f6f-f6e1-4e7b-9c5a-9a98f6c96a23',
          analysisId: 'f47ac10b-58cc-4372-a567-0e02b2c3d479',
          name: 'Cost',
          weight: 50
        }
      ],
      ratings: [
        {
          alternativeId: '550e8400-e29b-41d4-a716-446655440000',
          criterionId: '2c1b6f6f-f6e1-4e7b-9c5a-9a98f6c96a23',
          value: 4
        }
      ]
    }

    const result = GetRatingsResponseSchema.safeParse(validInput)

    expect(result.success).toBe(true)
  })

  it('rejects invalid rating uuid', () => {
    const invalidInput = {
      alternatives: [],
      criteria: [],
      ratings: [
        {
          alternativeId: 'not-a-uuid',
          criterionId: '2c1b6f6f-f6e1-4e7b-9c5a-9a98f6c96a23',
          value: 4
        }
      ]
    }

    const result = GetRatingsResponseSchema.safeParse(invalidInput)

    expect(result.success).toBe(false)
  })
})
