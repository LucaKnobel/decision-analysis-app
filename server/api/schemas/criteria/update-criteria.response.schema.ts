import * as z from 'zod'

const CriterionItemSchema = z.object({
  id: z.uuid(),
  analysisId: z.uuid(),
  name: z.string(),
  weight: z.number()
})

export const UpdateCriteriaResponseSchema = z.object({
  data: z.array(CriterionItemSchema)
})

export type UpdateCriteriaResponseDTO = z.infer<typeof UpdateCriteriaResponseSchema>
export type CriterionItemDTO = z.infer<typeof CriterionItemSchema>
