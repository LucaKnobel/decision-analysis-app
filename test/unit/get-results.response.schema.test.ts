import { describe, it, expect } from 'vitest'
import { GetResultsResponseSchema } from '../../server/api/schemas/results/get-results.response.schema'

describe('GetResultsResponseSchema', () => {
  it('accepts valid response', () => {
    const validInput = {
      alternatives: [
        { id: '550e8400-e29b-41d4-a716-446655440000', name: 'Option A' }
      ],
      criteria: [
        {
          id: '2c1b6f6f-f6e1-4e7b-9c5a-9a98f6c96a23',
          name: 'Cost',
          weight: 50,
          normalizedWeight: 0.5
        }
      ],
      weightSum: 100,
      results: [
        {
          alternativeId: '550e8400-e29b-41d4-a716-446655440000',
          alternativeName: 'Option A',
          totalScore: 4.2,
          rank: 1,
          contributions: [
            {
              criterionId: '2c1b6f6f-f6e1-4e7b-9c5a-9a98f6c96a23',
              rating: 4,
              weight: 50,
              normalizedWeight: 0.5,
              weightedScore: 2
            }
          ]
        }
      ]
    }

    const result = GetResultsResponseSchema.safeParse(validInput)

    expect(result.success).toBe(true)
  })

  it('rejects non-integer rank', () => {
    const invalidInput = {
      alternatives: [],
      criteria: [],
      weightSum: 100,
      results: [
        {
          alternativeId: '550e8400-e29b-41d4-a716-446655440000',
          alternativeName: 'Option A',
          totalScore: 4.2,
          rank: 1.5,
          contributions: []
        }
      ]
    }

    const result = GetResultsResponseSchema.safeParse(invalidInput)

    expect(result.success).toBe(false)
  })
})
