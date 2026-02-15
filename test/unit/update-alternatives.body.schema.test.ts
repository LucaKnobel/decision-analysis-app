import { describe, it, expect } from 'vitest'
import { UpdateAlternativesBodySchema } from '../../server/api/schemas/alternatives/update-alternatives.body.schema'

describe('UpdateAlternativesBodySchema', () => {
  it('accepts valid alternatives with optional id', () => {
    const validInput = {
      alternatives: [
        { id: '550e8400-e29b-41d4-a716-446655440000', name: 'Option A' },
        { name: 'Option B' }
      ]
    }

    const result = UpdateAlternativesBodySchema.safeParse(validInput)

    expect(result.success).toBe(true)
  })

  it('rejects duplicate names (case-insensitive)', () => {
    const invalidInput = {
      alternatives: [
        { name: 'Option A' },
        { name: 'option a' }
      ]
    }

    const result = UpdateAlternativesBodySchema.safeParse(invalidInput)

    expect(result.success).toBe(false)
  })

  it('rejects empty alternatives array', () => {
    const invalidInput = {
      alternatives: []
    }

    const result = UpdateAlternativesBodySchema.safeParse(invalidInput)

    expect(result.success).toBe(false)
  })
})
