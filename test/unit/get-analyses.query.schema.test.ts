import { describe, it, expect } from 'vitest'
import { GetAnalysesQuerySchema } from '../../server/api/schemas/analyses/get-analyses.query.schema'

describe('GetAnalysesQuerySchema', () => {
  it('applies defaults for empty input', () => {
    const result = GetAnalysesQuerySchema.safeParse({})

    expect(result.success).toBe(true)
    if (result.success) {
      expect(result.data.page).toBe(1)
      expect(result.data.limit).toBe(20)
      expect(result.data.sortBy).toBe('createdAt')
      expect(result.data.sortOrder).toBe('desc')
    }
  })

  it('coerces page and limit from strings', () => {
    const result = GetAnalysesQuerySchema.safeParse({ page: '3', limit: '25' })

    expect(result.success).toBe(true)
    if (result.success) {
      expect(result.data.page).toBe(3)
      expect(result.data.limit).toBe(25)
    }
  })

  it('rejects page less than 1', () => {
    const result = GetAnalysesQuerySchema.safeParse({ page: 0 })

    expect(result.success).toBe(false)
  })

  it('rejects limit greater than 100', () => {
    const result = GetAnalysesQuerySchema.safeParse({ limit: 101 })

    expect(result.success).toBe(false)
  })

  it('rejects invalid sortBy value', () => {
    const result = GetAnalysesQuerySchema.safeParse({ sortBy: 'invalid' })

    expect(result.success).toBe(false)
  })
})
