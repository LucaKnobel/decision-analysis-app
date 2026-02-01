import { describe, it, expect } from 'vitest'
import { DeleteAnalysisParamsSchema } from '../../server/api/schemas/analysis/delete-analysis.params.schema'

describe('DeleteAnalysisParamsSchema', () => {
  describe('Valid inputs', () => {
    it('should accept valid UUID', () => {
      const validInput = {
        id: '550e8400-e29b-41d4-a716-446655440000'
      }

      const result = DeleteAnalysisParamsSchema.safeParse(validInput)

      expect(result.success).toBe(true)
      if (result.success) {
        expect(result.data.id).toBe('550e8400-e29b-41d4-a716-446655440000')
      }
    })

    it('should accept different valid UUID formats', () => {
      const validInput = {
        id: '9b19115c-7cef-42bb-8064-05974be3bf05'
      }

      const result = DeleteAnalysisParamsSchema.safeParse(validInput)

      expect(result.success).toBe(true)
    })
  })

  describe('Invalid inputs', () => {
    it('should reject invalid UUID format', () => {
      const invalidInput = {
        id: 'not-a-valid-uuid'
      }

      const result = DeleteAnalysisParamsSchema.safeParse(invalidInput)

      expect(result.success).toBe(false)
      if (!result.success) {
        expect(result.error.issues[0].message).toBe('Invalid UUID')
      }
    })

    it('should reject empty string', () => {
      const invalidInput = {
        id: ''
      }

      const result = DeleteAnalysisParamsSchema.safeParse(invalidInput)

      expect(result.success).toBe(false)
    })

    it('should reject missing id field', () => {
      const invalidInput = {}

      const result = DeleteAnalysisParamsSchema.safeParse(invalidInput)

      expect(result.success).toBe(false)
    })

    it('should reject numeric id', () => {
      const invalidInput = {
        id: 12345
      }

      const result = DeleteAnalysisParamsSchema.safeParse(invalidInput)

      expect(result.success).toBe(false)
    })

    it('should reject UUID with invalid characters', () => {
      const invalidInput = {
        id: '550e8400-e29b-41d4-a716-44665544000g'
      }

      const result = DeleteAnalysisParamsSchema.safeParse(invalidInput)

      expect(result.success).toBe(false)
    })
  })
})
