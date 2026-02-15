import * as z from 'zod'

const AlternativeItemSchema = z.object({
  id: z.uuid(),
  analysisId: z.uuid(),
  name: z.string()
})

export const GetAlternativesResponseSchema = z.object({
  data: z.array(AlternativeItemSchema)
})

export type GetAlternativesResponseDTO = z.infer<typeof GetAlternativesResponseSchema>
export type AlternativeItemDTO = z.infer<typeof AlternativeItemSchema>
