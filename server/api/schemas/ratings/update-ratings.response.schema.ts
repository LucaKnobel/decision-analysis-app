import * as z from 'zod'

const RatingItemSchema = z.object({
  alternativeId: z.uuid(),
  criterionId: z.uuid(),
  value: z.number()
})

export const UpdateRatingsResponseSchema = z.object({
  data: z.array(RatingItemSchema)
})

export type UpdateRatingsResponseDTO = z.infer<typeof UpdateRatingsResponseSchema>
export type RatingItemDTO = z.infer<typeof RatingItemSchema>
