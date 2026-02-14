import * as z from 'zod'

export const UpdateCriteriaBodySchema = z.object({
  criteria: z.array(
    z.object({
      id: z.uuid().optional(),
      name: z.string()
        .trim()
        .min(1, 'Name is required')
        .max(100, 'Name must not exceed 100 characters'),
      weight: z.number()
        .int('Weight must be an integer')
        .min(0, 'Weight must be >= 0')
        .max(100, 'Weight must be <= 100')
    })
  ).min(1, 'At least one criterion is required')
}).refine((data) => {
  const names = data.criteria.map(criterion => criterion.name.toLowerCase())
  return new Set(names).size === names.length
}, {
  message: 'Criterion names must be unique',
  path: ['criteria']
}).refine((data) => {
  const total = data.criteria.reduce((sum, criterion) => sum + criterion.weight, 0)
  return total === 100
}, {
  message: 'Total weight must equal 100',
  path: ['criteria']
})

export type UpdateCriteriaBodyDTO = z.infer<typeof UpdateCriteriaBodySchema>
