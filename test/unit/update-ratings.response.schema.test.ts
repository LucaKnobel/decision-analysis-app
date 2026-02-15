import { describe, it, expect } from 'vitest'
import { UpdateRatingsResponseSchema } from '../../server/api/schemas/ratings/update-ratings.response.schema'

describe('UpdateRatingsResponseSchema', () => {
  it('accepts valid response', () => {
    const validInput = {
      data: [
        {
          alternativeId: '550e8400-e29b-41d4-a716-446655440000',
          criterionId: '2c1b6f6f-f6e1-4e7b-9c5a-9a98f6c96a23',
          value: 4
        }
      ]
    }

    const result = UpdateRatingsResponseSchema.safeParse(validInput)

    expect(result.success).toBe(true)
  })

  it('rejects missing data field', () => {
    const invalidInput = {}

    const result = UpdateRatingsResponseSchema.safeParse(invalidInput)

    expect(result.success).toBe(false)
  })
})
