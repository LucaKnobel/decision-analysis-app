import * as z from 'zod'

export const UpdateAlternativesBodySchema = z.object({
  alternatives: z.array(
    z.object({
      id: z.uuid().optional(),
      name: z.string()
        .trim()
        .min(1, 'Name is required')
        .max(200, 'Name must not exceed 200 characters')
    })
  ).min(1, 'At least one alternative is required')
}).refine((data) => {
  const names = data.alternatives.map(alternative => alternative.name.toLowerCase())
  return new Set(names).size === names.length
}, {
  message: 'Alternative names must be unique',
  path: ['alternatives']
})

export type UpdateAlternativesBodyDTO = z.infer<typeof UpdateAlternativesBodySchema>
