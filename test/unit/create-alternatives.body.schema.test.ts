// TC-ID: TC-UT-05
import { describe, it, expect } from 'vitest'
import { CreateAlternativesBodySchema } from '../../server/api/schemas/alternatives/create-alternatives.body.schema'

describe('CreateAlternativesBodySchema', () => {
  it('accepts valid alternatives and trims names', () => {
    const validInput = {
      alternatives: [
        { name: '  Option A  ' },
        { name: 'Option B' }
      ]
    }

    const result = CreateAlternativesBodySchema.safeParse(validInput)

    expect(result.success).toBe(true)
    if (result.success) {
      expect(result.data.alternatives[0].name).toBe('Option A')
    }
  })

  it('rejects duplicate names (case-insensitive)', () => {
    const invalidInput = {
      alternatives: [
        { name: 'Option A' },
        { name: 'option a' }
      ]
    }

    const result = CreateAlternativesBodySchema.safeParse(invalidInput)

    expect(result.success).toBe(false)
  })

  it('rejects empty alternatives array', () => {
    const invalidInput = {
      alternatives: []
    }

    const result = CreateAlternativesBodySchema.safeParse(invalidInput)

    expect(result.success).toBe(false)
  })
})
