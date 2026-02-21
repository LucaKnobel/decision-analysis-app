// TC-ID: TC-UT-08
import { describe, it, expect } from 'vitest'
import { GetContentQuerySchema } from '../../server/api/schemas/content/get-content.query.schema'

describe('GetContentQuerySchema', () => {
  it('defaults locale to en', () => {
    const result = GetContentQuerySchema.safeParse({})

    expect(result.success).toBe(true)
    if (result.success) {
      expect(result.data.locale).toBe('en')
    }
  })

  it('rejects unsupported locale', () => {
    const invalidInput = { locale: 'fr' }

    const result = GetContentQuerySchema.safeParse(invalidInput)

    expect(result.success).toBe(false)
  })
})
