import { describe, it, expect } from 'vitest'
import { CreateAnalysisBodySchema } from '../../server/api/schemas/analyses/create-analysis.body.schema'

describe('CreateAnalysisBodySchema', () => {
  it('accepts valid title and description', () => {
    const validInput = {
      title: 'Valid Analysis Title',
      description: 'This is a valid description'
    }

    const result = CreateAnalysisBodySchema.safeParse(validInput)

    expect(result.success).toBe(true)
  })

  it('trims title', () => {
    const validInput = {
      title: '  Trimmed Title  '
    }

    const result = CreateAnalysisBodySchema.safeParse(validInput)

    expect(result.success).toBe(true)
    if (result.success) {
      expect(result.data.title).toBe('Trimmed Title')
    }
  })

  it('rejects missing title', () => {
    const invalidInput = {
      description: 'Only description provided'
    }

    const result = CreateAnalysisBodySchema.safeParse(invalidInput)

    expect(result.success).toBe(false)
  })

  it('rejects description longer than 500 characters', () => {
    const invalidInput = {
      title: 'Valid Title',
      description: 'a'.repeat(501)
    }

    const result = CreateAnalysisBodySchema.safeParse(invalidInput)

    expect(result.success).toBe(false)
  })
})
