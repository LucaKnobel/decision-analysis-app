import * as z from 'zod'

const CriterionItemSchema = z.object({
  id: z.uuid(),
  analysisId: z.uuid(),
  name: z.string(),
  weight: z.number()
})

export const CreateCriteriaResponseSchema = z.object({
  data: z.array(CriterionItemSchema)
})

export type CreateCriteriaResponseDTO = z.infer<typeof CreateCriteriaResponseSchema>
export type CriterionItemDTO = z.infer<typeof CriterionItemSchema>
