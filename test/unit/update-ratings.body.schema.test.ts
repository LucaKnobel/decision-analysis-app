// TC-ID: TC-UT-06
import { describe, it, expect } from 'vitest'
import { UpdateRatingsBodySchema } from '../../server/api/schemas/ratings/update-ratings.body.schema'

describe('UpdateRatingsBodySchema', () => {
  it('accepts valid ratings', () => {
    const validInput = {
      ratings: [
        {
          alternativeId: '550e8400-e29b-41d4-a716-446655440000',
          criterionId: '2c1b6f6f-f6e1-4e7b-9c5a-9a98f6c96a23',
          value: 3
        }
      ]
    }

    const result = UpdateRatingsBodySchema.safeParse(validInput)

    expect(result.success).toBe(true)
  })

  it('rejects duplicate alternative/criterion pairs', () => {
    const invalidInput = {
      ratings: [
        {
          alternativeId: '550e8400-e29b-41d4-a716-446655440000',
          criterionId: '2c1b6f6f-f6e1-4e7b-9c5a-9a98f6c96a23',
          value: 3
        },
        {
          alternativeId: '550e8400-e29b-41d4-a716-446655440000',
          criterionId: '2c1b6f6f-f6e1-4e7b-9c5a-9a98f6c96a23',
          value: 4
        }
      ]
    }

    const result = UpdateRatingsBodySchema.safeParse(invalidInput)

    expect(result.success).toBe(false)
  })

  it('rejects rating outside 1-5', () => {
    const invalidInput = {
      ratings: [
        {
          alternativeId: '550e8400-e29b-41d4-a716-446655440000',
          criterionId: '2c1b6f6f-f6e1-4e7b-9c5a-9a98f6c96a23',
          value: 6
        }
      ]
    }

    const result = UpdateRatingsBodySchema.safeParse(invalidInput)

    expect(result.success).toBe(false)
  })
})
