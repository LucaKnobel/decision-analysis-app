import * as z from 'zod'

const CriterionItemSchema = z.object({
  id: z.uuid(),
  analysisId: z.uuid(),
  name: z.string(),
  weight: z.number()
})

export const GetCriteriaResponseSchema = z.object({
  data: z.array(CriterionItemSchema)
})

export type GetCriteriaResponseDTO = z.infer<typeof GetCriteriaResponseSchema>
export type CriterionItemDTO = z.infer<typeof CriterionItemSchema>
