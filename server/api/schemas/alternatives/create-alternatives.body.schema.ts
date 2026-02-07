import * as z from 'zod'

export const CreateAlternativesBodySchema = z.object({
  alternatives: z.array(
    z.object({
      name: z.string()
        .trim()
        .min(1, 'Name is required')
        .max(200, 'Name must not exceed 200 characters')
    })
  ).min(1, 'At least one alternative is required')
})

export type CreateAlternativesBodyDTO = z.infer<typeof CreateAlternativesBodySchema>
