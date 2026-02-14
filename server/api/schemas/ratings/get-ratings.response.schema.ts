import * as z from 'zod'

const AlternativeItemSchema = z.object({
  id: z.uuid(),
  analysisId: z.uuid(),
  name: z.string()
})

const CriterionItemSchema = z.object({
  id: z.uuid(),
  analysisId: z.uuid(),
  name: z.string(),
  weight: z.number()
})

const RatingItemSchema = z.object({
  alternativeId: z.uuid(),
  criterionId: z.uuid(),
  value: z.number()
})

export const GetRatingsResponseSchema = z.object({
  alternatives: z.array(AlternativeItemSchema),
  criteria: z.array(CriterionItemSchema),
  ratings: z.array(RatingItemSchema)
})

export type GetRatingsResponseDTO = z.infer<typeof GetRatingsResponseSchema>
export type RatingItemDTO = z.infer<typeof RatingItemSchema>
