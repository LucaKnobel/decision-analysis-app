import { describe, it, expect } from 'vitest'
import { GetAnalysesQuerySchema } from '../../server/api/schemas/analyses/get-analyses.query.schema'

describe('GetAnalysesQuerySchema', () => {
  describe('Valid inputs', () => {
    it('should accept empty object and apply defaults', () => {
      const validInput = {}

      const result = GetAnalysesQuerySchema.safeParse(validInput)

      expect(result.success).toBe(true)
      if (result.success) {
        expect(result.data.page).toBe(1)
        expect(result.data.limit).toBe(20)
        expect(result.data.sortBy).toBe('createdAt')
        expect(result.data.sortOrder).toBe('desc')
        expect(result.data.search).toBeUndefined()
      }
    })

    it('should accept all valid parameters', () => {
      const validInput = {
        page: 5,
        limit: 50,
        sortBy: 'title',
        sortOrder: 'asc',
        search: 'test search'
      }

      const result = GetAnalysesQuerySchema.safeParse(validInput)

      expect(result.success).toBe(true)
      if (result.success) {
        expect(result.data.page).toBe(5)
        expect(result.data.limit).toBe(50)
        expect(result.data.sortBy).toBe('title')
        expect(result.data.sortOrder).toBe('asc')
        expect(result.data.search).toBe('test search')
      }
    })

    it('should coerce string page to number', () => {
      const validInput = {
        page: '3'
      }

      const result = GetAnalysesQuerySchema.safeParse(validInput)

      expect(result.success).toBe(true)
      if (result.success) {
        expect(result.data.page).toBe(3)
      }
    })

    it('should coerce string limit to number', () => {
      const validInput = {
        limit: '25'
      }

      const result = GetAnalysesQuerySchema.safeParse(validInput)

      expect(result.success).toBe(true)
      if (result.success) {
        expect(result.data.limit).toBe(25)
      }
    })

    it('should accept minimum page value of 1', () => {
      const validInput = {
        page: 1
      }

      const result = GetAnalysesQuerySchema.safeParse(validInput)

      expect(result.success).toBe(true)
      if (result.success) {
        expect(result.data.page).toBe(1)
      }
    })

    it('should accept minimum limit value of 1', () => {
      const validInput = {
        limit: 1
      }

      const result = GetAnalysesQuerySchema.safeParse(validInput)

      expect(result.success).toBe(true)
      if (result.success) {
        expect(result.data.limit).toBe(1)
      }
    })

    it('should accept maximum limit value of 100', () => {
      const validInput = {
        limit: 100
      }

      const result = GetAnalysesQuerySchema.safeParse(validInput)

      expect(result.success).toBe(true)
      if (result.success) {
        expect(result.data.limit).toBe(100)
      }
    })

    it('should accept sortBy createdAt', () => {
      const validInput = {
        sortBy: 'createdAt'
      }

      const result = GetAnalysesQuerySchema.safeParse(validInput)

      expect(result.success).toBe(true)
      if (result.success) {
        expect(result.data.sortBy).toBe('createdAt')
      }
    })

    it('should accept sortBy updatedAt', () => {
      const validInput = {
        sortBy: 'updatedAt'
      }

      const result = GetAnalysesQuerySchema.safeParse(validInput)

      expect(result.success).toBe(true)
      if (result.success) {
        expect(result.data.sortBy).toBe('updatedAt')
      }
    })

    it('should accept sortBy title', () => {
      const validInput = {
        sortBy: 'title'
      }

      const result = GetAnalysesQuerySchema.safeParse(validInput)

      expect(result.success).toBe(true)
      if (result.success) {
        expect(result.data.sortBy).toBe('title')
      }
    })

    it('should accept sortOrder asc', () => {
      const validInput = {
        sortOrder: 'asc'
      }

      const result = GetAnalysesQuerySchema.safeParse(validInput)

      expect(result.success).toBe(true)
      if (result.success) {
        expect(result.data.sortOrder).toBe('asc')
      }
    })

    it('should accept sortOrder desc', () => {
      const validInput = {
        sortOrder: 'desc'
      }

      const result = GetAnalysesQuerySchema.safeParse(validInput)

      expect(result.success).toBe(true)
      if (result.success) {
        expect(result.data.sortOrder).toBe('desc')
      }
    })

    it('should trim search string', () => {
      const validInput = {
        search: '  test search  '
      }

      const result = GetAnalysesQuerySchema.safeParse(validInput)

      expect(result.success).toBe(true)
      if (result.success) {
        expect(result.data.search).toBe('test search')
      }
    })

    it('should accept search with maximum length (100 chars)', () => {
      const validInput = {
        search: 'a'.repeat(100)
      }

      const result = GetAnalysesQuerySchema.safeParse(validInput)

      expect(result.success).toBe(true)
    })

    it('should accept search with unicode characters', () => {
      const validInput = {
        search: 'Analyse Kosten-Nutzen 分析'
      }

      const result = GetAnalysesQuerySchema.safeParse(validInput)

      expect(result.success).toBe(true)
    })
  })

  describe('Invalid page', () => {
    it('should reject page less than 1', () => {
      const invalidInput = {
        page: 0
      }

      const result = GetAnalysesQuerySchema.safeParse(invalidInput)

      expect(result.success).toBe(false)
      if (!result.success) {
        expect(result.error.issues[0].message).toBe('Page must be at least 1')
      }
    })

    it('should reject negative page', () => {
      const invalidInput = {
        page: -5
      }

      const result = GetAnalysesQuerySchema.safeParse(invalidInput)

      expect(result.success).toBe(false)
      if (!result.success) {
        expect(result.error.issues[0].message).toBe('Page must be at least 1')
      }
    })

    it('should reject non-integer page', () => {
      const invalidInput = {
        page: 1.5
      }

      const result = GetAnalysesQuerySchema.safeParse(invalidInput)

      expect(result.success).toBe(false)
      if (!result.success) {
        expect(result.error.issues[0].message).toBe('Page must be an integer')
      }
    })

    it('should reject non-numeric page string', () => {
      const invalidInput = {
        page: 'abc'
      }

      const result = GetAnalysesQuerySchema.safeParse(invalidInput)

      expect(result.success).toBe(false)
    })
  })

  describe('Invalid limit', () => {
    it('should reject limit less than 1', () => {
      const invalidInput = {
        limit: 0
      }

      const result = GetAnalysesQuerySchema.safeParse(invalidInput)

      expect(result.success).toBe(false)
      if (!result.success) {
        expect(result.error.issues[0].message).toBe('Limit must be at least 1')
      }
    })

    it('should reject negative limit', () => {
      const invalidInput = {
        limit: -10
      }

      const result = GetAnalysesQuerySchema.safeParse(invalidInput)

      expect(result.success).toBe(false)
      if (!result.success) {
        expect(result.error.issues[0].message).toBe('Limit must be at least 1')
      }
    })

    it('should reject limit greater than 100', () => {
      const invalidInput = {
        limit: 101
      }

      const result = GetAnalysesQuerySchema.safeParse(invalidInput)

      expect(result.success).toBe(false)
      if (!result.success) {
        expect(result.error.issues[0].message).toBe('Limit must not exceed 100')
      }
    })

    it('should reject non-integer limit', () => {
      const invalidInput = {
        limit: 10.5
      }

      const result = GetAnalysesQuerySchema.safeParse(invalidInput)

      expect(result.success).toBe(false)
      if (!result.success) {
        expect(result.error.issues[0].message).toBe('Limit must be an integer')
      }
    })

    it('should reject non-numeric limit string', () => {
      const invalidInput = {
        limit: 'xyz'
      }

      const result = GetAnalysesQuerySchema.safeParse(invalidInput)

      expect(result.success).toBe(false)
    })
  })

  describe('Invalid sortBy', () => {
    it('should reject invalid sortBy value', () => {
      const invalidInput = {
        sortBy: 'invalid'
      }

      const result = GetAnalysesQuerySchema.safeParse(invalidInput)

      expect(result.success).toBe(false)
    })

    it('should reject sortBy as number', () => {
      const invalidInput = {
        sortBy: 123
      }

      const result = GetAnalysesQuerySchema.safeParse(invalidInput)

      expect(result.success).toBe(false)
    })
  })

  describe('Invalid sortOrder', () => {
    it('should reject invalid sortOrder value', () => {
      const invalidInput = {
        sortOrder: 'ascending'
      }

      const result = GetAnalysesQuerySchema.safeParse(invalidInput)

      expect(result.success).toBe(false)
    })

    it('should reject sortOrder as number', () => {
      const invalidInput = {
        sortOrder: 1
      }

      const result = GetAnalysesQuerySchema.safeParse(invalidInput)

      expect(result.success).toBe(false)
    })
  })

  describe('Invalid search', () => {
    it('should reject search with only whitespace', () => {
      const invalidInput = {
        search: '   '
      }

      const result = GetAnalysesQuerySchema.safeParse(invalidInput)

      expect(result.success).toBe(false)
      if (!result.success) {
        expect(result.error.issues[0].message).toBe('Search must not be empty')
      }
    })

    it('should reject search exceeding 100 characters', () => {
      const invalidInput = {
        search: 'a'.repeat(101)
      }

      const result = GetAnalysesQuerySchema.safeParse(invalidInput)

      expect(result.success).toBe(false)
      if (!result.success) {
        expect(result.error.issues[0].message).toBe('Search must not exceed 100 characters')
      }
    })
  })
})
