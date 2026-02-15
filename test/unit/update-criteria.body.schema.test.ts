import { describe, it, expect } from 'vitest'
import { UpdateCriteriaBodySchema } from '../../server/api/schemas/criteria/update-criteria.body.schema'

describe('UpdateCriteriaBodySchema', () => {
  it('accepts valid criteria with sum 100', () => {
    const validInput = {
      criteria: [
        { id: '550e8400-e29b-41d4-a716-446655440000', name: 'Cost', weight: 0 },
        { name: 'Quality', weight: 100 }
      ]
    }

    const result = UpdateCriteriaBodySchema.safeParse(validInput)

    expect(result.success).toBe(true)
  })

  it('rejects duplicate names (case-insensitive)', () => {
    const invalidInput = {
      criteria: [
        { name: 'Cost', weight: 50 },
        { name: 'cost', weight: 50 }
      ]
    }

    const result = UpdateCriteriaBodySchema.safeParse(invalidInput)

    expect(result.success).toBe(false)
  })

  it('rejects negative weight', () => {
    const invalidInput = {
      criteria: [
        { name: 'Cost', weight: -1 },
        { name: 'Quality', weight: 101 }
      ]
    }

    const result = UpdateCriteriaBodySchema.safeParse(invalidInput)

    expect(result.success).toBe(false)
  })
})
