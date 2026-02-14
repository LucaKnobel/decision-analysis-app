import * as z from 'zod'

export const CreateCriteriaBodySchema = z.object({
  criteria: z.array(
    z.object({
      name: z.string()
        .trim()
        .min(1, 'Name is required')
        .max(100, 'Name must not exceed 100 characters'),
      weight: z.number()
        .int('Weight must be an integer')
        .min(1, 'Weight must be >= 1')
        .max(100, 'Weight must be <= 100')
    })
  ).min(1, 'At least one criterion is required')
}).refine((data) => {
  const total = data.criteria.reduce((sum, criterion) => sum + criterion.weight, 0)
  return total === 100
}, {
  message: 'Total weight must equal 100',
  path: ['criteria']
})

export type CreateCriteriaBodyDTO = z.infer<typeof CreateCriteriaBodySchema>
