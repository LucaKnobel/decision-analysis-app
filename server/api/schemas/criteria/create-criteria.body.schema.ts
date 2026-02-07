import * as z from 'zod'

export const CreateCriteriaBodySchema = z.object({
  criteria: z.array(
    z.object({
      name: z.string()
        .trim()
        .min(1, 'Name is required')
        .max(100, 'Name must not exceed 100 characters')
    })
  ).min(1, 'At least one criterion is required')
})

export type CreateCriteriaBodyDTO = z.infer<typeof CreateCriteriaBodySchema>
