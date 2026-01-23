import { describe, it, expect } from 'vitest'
import { CreateAnalysisResponseSchema } from '../../server/api/schemas/analysis/create-analysis.response.schema'

describe('CreateAnalysisResponseSchema', () => {
  describe('Valid inputs', () => {
    it('should accept valid UUID', () => {
      const validInput = {
        id: '123e4567-e89b-12d3-a456-426614174000'
      }

      const result = CreateAnalysisResponseSchema.safeParse(validInput)

      expect(result.success).toBe(true)
      if (result.success) {
        expect(result.data.id).toBe('123e4567-e89b-12d3-a456-426614174000')
      }
    })

    it('should accept different valid UUID formats', () => {
      const validUUIDs = [
        '550e8400-e29b-41d4-a716-446655440000',
        'f47ac10b-58cc-4372-a567-0e02b2c3d479',
        '6ba7b810-9dad-11d1-80b4-00c04fd430c8'
      ]

      validUUIDs.forEach((uuid) => {
        const result = CreateAnalysisResponseSchema.safeParse({ id: uuid })
        expect(result.success).toBe(true)
      })
    })
  })

  describe('Invalid inputs', () => {
    it('should reject non-UUID string', () => {
      const invalidInput = {
        id: 'not-a-uuid'
      }

      const result = CreateAnalysisResponseSchema.safeParse(invalidInput)

      expect(result.success).toBe(false)
      if (!result.success) {
        expect(result.error.issues[0].message).toContain('Invalid UUID')
      }
    })

    it('should reject empty string', () => {
      const invalidInput = {
        id: ''
      }

      const result = CreateAnalysisResponseSchema.safeParse(invalidInput)

      expect(result.success).toBe(false)
    })

    it('should reject missing id field', () => {
      const invalidInput = {}

      const result = CreateAnalysisResponseSchema.safeParse(invalidInput)

      expect(result.success).toBe(false)
    })

    it('should reject null id', () => {
      const invalidInput = {
        id: null
      }

      const result = CreateAnalysisResponseSchema.safeParse(invalidInput)

      expect(result.success).toBe(false)
    })

    it('should reject numeric id', () => {
      const invalidInput = {
        id: 12345
      }

      const result = CreateAnalysisResponseSchema.safeParse(invalidInput)

      expect(result.success).toBe(false)
    })

    it('should reject UUID with wrong format (no hyphens)', () => {
      const invalidInput = {
        id: '123e4567e89b12d3a456426614174000'
      }

      const result = CreateAnalysisResponseSchema.safeParse(invalidInput)

      expect(result.success).toBe(false)
    })

    it('should reject UUID with wrong length', () => {
      const invalidInput = {
        id: '123e4567-e89b-12d3-a456'
      }

      const result = CreateAnalysisResponseSchema.safeParse(invalidInput)

      expect(result.success).toBe(false)
    })

    it('should reject UUID with invalid characters', () => {
      const invalidInput = {
        id: '123e4567-e89b-12d3-a456-42661417400g'
      }

      const result = CreateAnalysisResponseSchema.safeParse(invalidInput)

      expect(result.success).toBe(false)
    })

    it('should reject array as id', () => {
      const invalidInput = {
        id: ['123e4567-e89b-12d3-a456-426614174000']
      }

      const result = CreateAnalysisResponseSchema.safeParse(invalidInput)

      expect(result.success).toBe(false)
    })

    it('should reject object as id', () => {
      const invalidInput = {
        id: { value: '123e4567-e89b-12d3-a456-426614174000' }
      }

      const result = CreateAnalysisResponseSchema.safeParse(invalidInput)

      expect(result.success).toBe(false)
    })
  })

  describe('Additional fields', () => {
    it('should strip additional fields not in schema', () => {
      const inputWithExtra = {
        id: '123e4567-e89b-12d3-a456-426614174000',
        title: 'Should be stripped',
        createdAt: new Date(),
        extraField: 123
      }

      const result = CreateAnalysisResponseSchema.safeParse(inputWithExtra)

      expect(result.success).toBe(true)
      if (result.success) {
        // Additional fields are stripped, only schema fields remain
        expect(result.data).toEqual({
          id: '123e4567-e89b-12d3-a456-426614174000'
        })
        expect(result.data).not.toHaveProperty('title')
        expect(result.data).not.toHaveProperty('createdAt')
        expect(result.data).not.toHaveProperty('extraField')
      }
    })
  })

  describe('Edge cases', () => {
    it('should reject UUID with leading/trailing whitespace', () => {
      const invalidInput = {
        id: ' 123e4567-e89b-12d3-a456-426614174000 '
      }

      const result = CreateAnalysisResponseSchema.safeParse(invalidInput)

      expect(result.success).toBe(false)
    })

    it('should handle boolean as id', () => {
      const invalidInput = {
        id: true
      }

      const result = CreateAnalysisResponseSchema.safeParse(invalidInput)

      expect(result.success).toBe(false)
    })
  })
})
