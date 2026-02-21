// TC-ID: TC-UT-08
import { describe, it, expect } from 'vitest'
import { GetContentParamsSchema } from '../../server/api/schemas/content/get-content.params.schema'

describe('GetContentParamsSchema', () => {
  it('accepts a valid slug', () => {
    const validInput = { slug: 'legal/privacy' }

    const result = GetContentParamsSchema.safeParse(validInput)

    expect(result.success).toBe(true)
  })

  it('rejects empty slug', () => {
    const invalidInput = { slug: '' }

    const result = GetContentParamsSchema.safeParse(invalidInput)

    expect(result.success).toBe(false)
  })
})
