import { describe, it, expect } from 'vitest'
import { GetAnalysesResponseSchema } from '../../server/api/schemas/analysis/get-analyses.response.schema'

describe('GetAnalysesResponseSchema', () => {
  const validAnalysisItem = {
    id: '550e8400-e29b-41d4-a716-446655440000',
    title: 'Test Analysis',
    description: 'Test description',
    createdAt: '2026-01-15T10:30:00Z',
    updatedAt: '2026-01-20T14:45:00Z'
  }

  const validPagination = {
    page: 1,
    limit: 20,
    total: 100,
    totalPages: 5
  }

  describe('Valid inputs', () => {
    it('should accept valid response with data and pagination', () => {
      const validInput = {
        data: [validAnalysisItem],
        pagination: validPagination
      }

      const result = GetAnalysesResponseSchema.safeParse(validInput)

      expect(result.success).toBe(true)
      if (result.success) {
        expect(result.data.data).toHaveLength(1)
        expect(result.data.pagination.page).toBe(1)
      }
    })

    it('should accept empty data array', () => {
      const validInput = {
        data: [],
        pagination: {
          page: 1,
          limit: 20,
          total: 0,
          totalPages: 1
        }
      }

      const result = GetAnalysesResponseSchema.safeParse(validInput)

      expect(result.success).toBe(true)
      if (result.success) {
        expect(result.data.data).toHaveLength(0)
      }
    })

    it('should accept multiple analysis items', () => {
      const validInput = {
        data: [
          validAnalysisItem,
          {
            id: 'f47ac10b-58cc-4372-a567-0e02b2c3d479',
            title: 'Second Analysis',
            description: null,
            createdAt: '2026-01-10T08:00:00Z',
            updatedAt: '2026-01-10T08:00:00Z'
          }
        ],
        pagination: validPagination
      }

      const result = GetAnalysesResponseSchema.safeParse(validInput)

      expect(result.success).toBe(true)
      if (result.success) {
        expect(result.data.data).toHaveLength(2)
      }
    })

    it('should accept analysis item with null description', () => {
      const validInput = {
        data: [{
          ...validAnalysisItem,
          description: null
        }],
        pagination: validPagination
      }

      const result = GetAnalysesResponseSchema.safeParse(validInput)

      expect(result.success).toBe(true)
      if (result.success) {
        expect(result.data.data[0].description).toBeNull()
      }
    })

    it('should accept pagination with maximum limit', () => {
      const validInput = {
        data: [],
        pagination: {
          page: 1,
          limit: 100,
          total: 0,
          totalPages: 1
        }
      }

      const result = GetAnalysesResponseSchema.safeParse(validInput)

      expect(result.success).toBe(true)
    })

    it('should accept high page number', () => {
      const validInput = {
        data: [],
        pagination: {
          page: 999,
          limit: 20,
          total: 20000,
          totalPages: 1000
        }
      }

      const result = GetAnalysesResponseSchema.safeParse(validInput)

      expect(result.success).toBe(true)
    })

    it('should accept ISO datetime with milliseconds', () => {
      const validInput = {
        data: [{
          ...validAnalysisItem,
          createdAt: '2026-01-15T10:30:00.123Z',
          updatedAt: '2026-01-20T14:45:00.456Z'
        }],
        pagination: validPagination
      }

      const result = GetAnalysesResponseSchema.safeParse(validInput)

      expect(result.success).toBe(true)
    })

    it('should reject ISO datetime with timezone offset (only UTC allowed)', () => {
      const invalidInput = {
        data: [{
          ...validAnalysisItem,
          createdAt: '2026-01-15T10:30:00+02:00',
          updatedAt: '2026-01-20T14:45:00-05:00'
        }],
        pagination: validPagination
      }

      const result = GetAnalysesResponseSchema.safeParse(invalidInput)

      expect(result.success).toBe(false)
    })
  })

  describe('Invalid data array', () => {
    it('should reject missing data field', () => {
      const invalidInput = {
        pagination: validPagination
      }

      const result = GetAnalysesResponseSchema.safeParse(invalidInput)

      expect(result.success).toBe(false)
    })

    it('should reject null data field', () => {
      const invalidInput = {
        data: null,
        pagination: validPagination
      }

      const result = GetAnalysesResponseSchema.safeParse(invalidInput)

      expect(result.success).toBe(false)
    })

    it('should reject data as non-array', () => {
      const invalidInput = {
        data: validAnalysisItem,
        pagination: validPagination
      }

      const result = GetAnalysesResponseSchema.safeParse(invalidInput)

      expect(result.success).toBe(false)
    })
  })

  describe('Invalid analysis item', () => {
    it('should reject item with invalid UUID', () => {
      const invalidInput = {
        data: [{
          ...validAnalysisItem,
          id: 'not-a-uuid'
        }],
        pagination: validPagination
      }

      const result = GetAnalysesResponseSchema.safeParse(invalidInput)

      expect(result.success).toBe(false)
    })

    it('should reject item with missing id', () => {
      const invalidInput = {
        data: [{
          title: 'Test',
          description: 'Test',
          createdAt: '2026-01-15T10:30:00Z',
          updatedAt: '2026-01-20T14:45:00Z'
        }],
        pagination: validPagination
      }

      const result = GetAnalysesResponseSchema.safeParse(invalidInput)

      expect(result.success).toBe(false)
    })

    it('should reject item with missing title', () => {
      const invalidInput = {
        data: [{
          id: '550e8400-e29b-41d4-a716-446655440000',
          description: 'Test',
          createdAt: '2026-01-15T10:30:00Z',
          updatedAt: '2026-01-20T14:45:00Z'
        }],
        pagination: validPagination
      }

      const result = GetAnalysesResponseSchema.safeParse(invalidInput)

      expect(result.success).toBe(false)
    })

    it('should reject item with invalid createdAt format', () => {
      const invalidInput = {
        data: [{
          ...validAnalysisItem,
          createdAt: '2026-01-15'
        }],
        pagination: validPagination
      }

      const result = GetAnalysesResponseSchema.safeParse(invalidInput)

      expect(result.success).toBe(false)
    })

    it('should reject item with invalid updatedAt format', () => {
      const invalidInput = {
        data: [{
          ...validAnalysisItem,
          updatedAt: 'invalid-date'
        }],
        pagination: validPagination
      }

      const result = GetAnalysesResponseSchema.safeParse(invalidInput)

      expect(result.success).toBe(false)
    })

    it('should reject item with numeric timestamps', () => {
      const invalidInput = {
        data: [{
          ...validAnalysisItem,
          createdAt: 1737025800000,
          updatedAt: 1737388800000
        }],
        pagination: validPagination
      }

      const result = GetAnalysesResponseSchema.safeParse(invalidInput)

      expect(result.success).toBe(false)
    })
  })

  describe('Invalid pagination', () => {
    it('should reject missing pagination field', () => {
      const invalidInput = {
        data: [validAnalysisItem]
      }

      const result = GetAnalysesResponseSchema.safeParse(invalidInput)

      expect(result.success).toBe(false)
    })

    it('should reject null pagination', () => {
      const invalidInput = {
        data: [validAnalysisItem],
        pagination: null
      }

      const result = GetAnalysesResponseSchema.safeParse(invalidInput)

      expect(result.success).toBe(false)
    })

    it('should reject pagination with page less than 1', () => {
      const invalidInput = {
        data: [],
        pagination: {
          ...validPagination,
          page: 0
        }
      }

      const result = GetAnalysesResponseSchema.safeParse(invalidInput)

      expect(result.success).toBe(false)
    })

    it('should reject pagination with negative page', () => {
      const invalidInput = {
        data: [],
        pagination: {
          ...validPagination,
          page: -1
        }
      }

      const result = GetAnalysesResponseSchema.safeParse(invalidInput)

      expect(result.success).toBe(false)
    })

    it('should reject pagination with limit less than 1', () => {
      const invalidInput = {
        data: [],
        pagination: {
          ...validPagination,
          limit: 0
        }
      }

      const result = GetAnalysesResponseSchema.safeParse(invalidInput)

      expect(result.success).toBe(false)
    })

    it('should reject pagination with limit greater than 100', () => {
      const invalidInput = {
        data: [],
        pagination: {
          ...validPagination,
          limit: 101
        }
      }

      const result = GetAnalysesResponseSchema.safeParse(invalidInput)

      expect(result.success).toBe(false)
    })

    it('should reject pagination with negative total', () => {
      const invalidInput = {
        data: [],
        pagination: {
          ...validPagination,
          total: -1
        }
      }

      const result = GetAnalysesResponseSchema.safeParse(invalidInput)

      expect(result.success).toBe(false)
    })

    it('should reject pagination with totalPages less than 1', () => {
      const invalidInput = {
        data: [],
        pagination: {
          ...validPagination,
          totalPages: 0
        }
      }

      const result = GetAnalysesResponseSchema.safeParse(invalidInput)

      expect(result.success).toBe(false)
    })

    it('should reject pagination with non-integer page', () => {
      const invalidInput = {
        data: [],
        pagination: {
          ...validPagination,
          page: 1.5
        }
      }

      const result = GetAnalysesResponseSchema.safeParse(invalidInput)

      expect(result.success).toBe(false)
    })

    it('should reject pagination with non-integer limit', () => {
      const invalidInput = {
        data: [],
        pagination: {
          ...validPagination,
          limit: 10.5
        }
      }

      const result = GetAnalysesResponseSchema.safeParse(invalidInput)

      expect(result.success).toBe(false)
    })

    it('should reject pagination with missing fields', () => {
      const invalidInput = {
        data: [],
        pagination: {
          page: 1
        }
      }

      const result = GetAnalysesResponseSchema.safeParse(invalidInput)

      expect(result.success).toBe(false)
    })
  })
})
