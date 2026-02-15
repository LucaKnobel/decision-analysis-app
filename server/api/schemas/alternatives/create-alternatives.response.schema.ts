import * as z from 'zod'

const AlternativeItemSchema = z.object({
  id: z.uuid(),
  analysisId: z.uuid(),
  name: z.string()
})

export const CreateAlternativesResponseSchema = z.object({
  data: z.array(AlternativeItemSchema)
})

export type CreateAlternativesResponseDTO = z.infer<typeof CreateAlternativesResponseSchema>
export type AlternativeItemDTO = z.infer<typeof AlternativeItemSchema>
