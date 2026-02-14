import * as z from 'zod'

const ResultAlternativeSchema = z.object({
  id: z.uuid(),
  name: z.string()
})

const ResultCriterionSchema = z.object({
  id: z.uuid(),
  name: z.string(),
  weight: z.number(),
  normalizedWeight: z.number()
})

const ResultContributionSchema = z.object({
  criterionId: z.uuid(),
  rating: z.number(),
  weight: z.number(),
  normalizedWeight: z.number(),
  weightedScore: z.number()
})

const ResultItemSchema = z.object({
  alternativeId: z.uuid(),
  alternativeName: z.string(),
  totalScore: z.number(),
  rank: z.number().int(),
  contributions: z.array(ResultContributionSchema)
})

export const GetResultsResponseSchema = z.object({
  alternatives: z.array(ResultAlternativeSchema),
  criteria: z.array(ResultCriterionSchema),
  weightSum: z.number(),
  results: z.array(ResultItemSchema)
})

export type GetResultsResponseDTO = z.infer<typeof GetResultsResponseSchema>
export type ResultAlternativeDTO = z.infer<typeof ResultAlternativeSchema>
export type ResultCriterionDTO = z.infer<typeof ResultCriterionSchema>
export type ResultContributionDTO = z.infer<typeof ResultContributionSchema>
export type ResultItemDTO = z.infer<typeof ResultItemSchema>
