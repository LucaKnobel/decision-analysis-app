import { describe, it, expect } from 'vitest'
import { CreateAnalysisBodySchema } from '../../server/api/schemas/analysis/create-analysis.body.schema'

describe('CreateAnalysisBodySchema', () => {
  describe('Valid inputs', () => {
    it('should accept valid title and description', () => {
      const validInput = {
        title: 'Valid Analysis Title',
        description: 'This is a valid description'
      }

      const result = CreateAnalysisBodySchema.safeParse(validInput)

      expect(result.success).toBe(true)
      if (result.success) {
        expect(result.data.title).toBe('Valid Analysis Title')
        expect(result.data.description).toBe('This is a valid description')
      }
    })

    it('should accept title without description', () => {
      const validInput = {
        title: 'Valid Title Only'
      }

      const result = CreateAnalysisBodySchema.safeParse(validInput)

      expect(result.success).toBe(true)
      if (result.success) {
        expect(result.data.title).toBe('Valid Title Only')
        expect(result.data.description).toBeUndefined()
      }
    })

    it('should accept title with empty description', () => {
      const validInput = {
        title: 'Valid Title',
        description: ''
      }

      const result = CreateAnalysisBodySchema.safeParse(validInput)

      expect(result.success).toBe(true)
    })

    it('should accept title with maximum length (100 chars)', () => {
      const validInput = {
        title: 'a'.repeat(100)
      }

      const result = CreateAnalysisBodySchema.safeParse(validInput)

      expect(result.success).toBe(true)
    })

    it('should accept description with maximum length (500 chars)', () => {
      const validInput = {
        title: 'Valid Title',
        description: 'a'.repeat(500)
      }

      const result = CreateAnalysisBodySchema.safeParse(validInput)

      expect(result.success).toBe(true)
    })

    it('should accept special characters in title', () => {
      const validInput = {
        title: 'Analysis #1: Cost-Benefit & ROI (2026)'
      }

      const result = CreateAnalysisBodySchema.safeParse(validInput)

      expect(result.success).toBe(true)
    })

    it('should accept unicode characters', () => {
      const validInput = {
        title: 'Analyse: Kosten-Nutzen 分析',
        description: 'Beschreibung mit Émojis 🎯'
      }

      const result = CreateAnalysisBodySchema.safeParse(validInput)

      expect(result.success).toBe(true)
    })
  })

  describe('Invalid title', () => {
    it('should reject empty title', () => {
      const invalidInput = {
        title: ''
      }

      const result = CreateAnalysisBodySchema.safeParse(invalidInput)

      expect(result.success).toBe(false)
      if (!result.success) {
        expect(result.error.issues[0].message).toBe('Title is required')
      }
    })

    it('should reject title exceeding 100 characters', () => {
      const invalidInput = {
        title: 'a'.repeat(101)
      }

      const result = CreateAnalysisBodySchema.safeParse(invalidInput)

      expect(result.success).toBe(false)
      if (!result.success) {
        expect(result.error.issues[0].message).toBe('Title must not exceed 100 characters')
      }
    })

    it('should reject missing title', () => {
      const invalidInput = {
        description: 'Only description provided'
      }

      const result = CreateAnalysisBodySchema.safeParse(invalidInput)

      expect(result.success).toBe(false)
    })

    it('should reject null title', () => {
      const invalidInput = {
        title: null
      }

      const result = CreateAnalysisBodySchema.safeParse(invalidInput)

      expect(result.success).toBe(false)
    })

    it('should reject numeric title', () => {
      const invalidInput = {
        title: 12345
      }

      const result = CreateAnalysisBodySchema.safeParse(invalidInput)

      expect(result.success).toBe(false)
    })

    it('should reject title as array', () => {
      const invalidInput = {
        title: ['Invalid', 'Title']
      }

      const result = CreateAnalysisBodySchema.safeParse(invalidInput)

      expect(result.success).toBe(false)
    })

    it('should reject title as object', () => {
      const invalidInput = {
        title: { value: 'Invalid' }
      }

      const result = CreateAnalysisBodySchema.safeParse(invalidInput)

      expect(result.success).toBe(false)
    })
  })

  describe('Invalid description', () => {
    it('should reject description exceeding 500 characters', () => {
      const invalidInput = {
        title: 'Valid Title',
        description: 'a'.repeat(501)
      }

      const result = CreateAnalysisBodySchema.safeParse(invalidInput)

      expect(result.success).toBe(false)
      if (!result.success) {
        expect(result.error.issues[0].message).toBe('Description must not exceed 500 characters')
      }
    })

    it('should reject numeric description', () => {
      const invalidInput = {
        title: 'Valid Title',
        description: 12345
      }

      const result = CreateAnalysisBodySchema.safeParse(invalidInput)

      expect(result.success).toBe(false)
    })

    it('should reject null description', () => {
      const invalidInput = {
        title: 'Valid Title',
        description: null
      }

      const result = CreateAnalysisBodySchema.safeParse(invalidInput)

      expect(result.success).toBe(false)
    })

    it('should reject description as array', () => {
      const invalidInput = {
        title: 'Valid Title',
        description: ['Invalid', 'Description']
      }

      const result = CreateAnalysisBodySchema.safeParse(invalidInput)

      expect(result.success).toBe(false)
    })

    it('should reject description as object', () => {
      const invalidInput = {
        title: 'Valid Title',
        description: { text: 'Invalid' }
      }

      const result = CreateAnalysisBodySchema.safeParse(invalidInput)

      expect(result.success).toBe(false)
    })
  })

  describe('Additional fields', () => {
    it('should strip additional fields not in schema', () => {
      const inputWithExtra = {
        title: 'Valid Title',
        description: 'Valid Description',
        extraField: 'Should be stripped',
        anotherField: 123
      }

      const result = CreateAnalysisBodySchema.safeParse(inputWithExtra)

      expect(result.success).toBe(true)
      if (result.success) {
        // Additional fields are stripped, only schema fields remain
        expect(result.data).toEqual({
          title: 'Valid Title',
          description: 'Valid Description'
        })
        expect(result.data).not.toHaveProperty('extraField')
        expect(result.data).not.toHaveProperty('anotherField')
      }
    })
  })

  describe('Edge cases', () => {
    it('should handle whitespace-only title as empty', () => {
      const invalidInput = {
        title: '   '
      }

      const result = CreateAnalysisBodySchema.safeParse(invalidInput)

      expect(result.success).toBe(false)
    })

    it('should handle title with leading/trailing whitespace', () => {
      const validInput = {
        title: '  Valid Title  '
      }

      const result = CreateAnalysisBodySchema.safeParse(validInput)

      expect(result.success).toBe(true)
      if (result.success) {
        expect(result.data.title).toBe('Valid Title')
      }
    })

    it('should handle newlines in title', () => {
      const validInput = {
        title: 'Title\nWith\nNewlines'
      }

      const result = CreateAnalysisBodySchema.safeParse(validInput)

      expect(result.success).toBe(true)
    })

    it('should handle newlines in description', () => {
      const validInput = {
        title: 'Valid Title',
        description: 'Line 1\nLine 2\nLine 3'
      }

      const result = CreateAnalysisBodySchema.safeParse(validInput)

      expect(result.success).toBe(true)
    })
  })
})
