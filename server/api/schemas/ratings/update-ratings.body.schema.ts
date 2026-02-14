import * as z from 'zod'

export const UpdateRatingsBodySchema = z.object({
  ratings: z.array(
    z.object({
      alternativeId: z.uuid(),
      criterionId: z.uuid(),
      value: z.number()
        .int('Rating must be an integer')
        .min(1, 'Rating must be >= 1')
        .max(5, 'Rating must be <= 5')
    })
  ).min(1, 'At least one rating is required')
}).refine((data) => {
  const keys = data.ratings.map(rating => `${rating.alternativeId}:${rating.criterionId}`)
  return new Set(keys).size === keys.length
}, {
  message: 'Ratings must be unique per alternative and criterion',
  path: ['ratings']
})

export type UpdateRatingsBodyDTO = z.infer<typeof UpdateRatingsBodySchema>
