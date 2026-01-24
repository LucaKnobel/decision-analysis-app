import * as z from 'zod'

const AnalysisItemSchema = z.object({
  id: z.uuid(),
  title: z.string(),
  description: z.string().nullable(),
  createdAt: z.iso.datetime(),
  updatedAt: z.iso.datetime()
})

export const GetAnalysesResponseSchema = z.object({
  data: z.array(AnalysisItemSchema),
  pagination: z.object({
    page: z.number().int().min(1),
    limit: z.number().int().min(1).max(100),
    total: z.number().int().min(0),
    totalPages: z.number().int().min(1)
  })
})

export type GetAnalysesResponseDTO = z.infer<typeof GetAnalysesResponseSchema>
export type AnalysisItemDTO = z.infer<typeof AnalysisItemSchema>
