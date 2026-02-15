import { describe, it, expect } from 'vitest'
import { CreateCriteriaBodySchema } from '../../server/api/schemas/criteria/create-criteria.body.schema'

describe('CreateCriteriaBodySchema', () => {
  it('accepts valid criteria with weight sum 100', () => {
    const validInput = {
      criteria: [
        { name: 'Cost', weight: 60 },
        { name: 'Quality', weight: 40 }
      ]
    }

    const result = CreateCriteriaBodySchema.safeParse(validInput)

    expect(result.success).toBe(true)
  })

  it('rejects duplicate names (case-insensitive)', () => {
    const invalidInput = {
      criteria: [
        { name: 'Cost', weight: 60 },
        { name: 'cost', weight: 40 }
      ]
    }

    const result = CreateCriteriaBodySchema.safeParse(invalidInput)

    expect(result.success).toBe(false)
  })

  it('rejects weight sum not equal to 100', () => {
    const invalidInput = {
      criteria: [
        { name: 'Cost', weight: 50 },
        { name: 'Quality', weight: 40 }
      ]
    }

    const result = CreateCriteriaBodySchema.safeParse(invalidInput)

    expect(result.success).toBe(false)
  })
})
