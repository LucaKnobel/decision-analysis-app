import * as z from 'zod'

const AlternativeItemSchema = z.object({
  id: z.uuid(),
  analysisId: z.uuid(),
  name: z.string()
})

export const UpdateAlternativesResponseSchema = z.object({
  data: z.array(AlternativeItemSchema)
})

export type UpdateAlternativesResponseDTO = z.infer<typeof UpdateAlternativesResponseSchema>
export type AlternativeItemDTO = z.infer<typeof AlternativeItemSchema>
