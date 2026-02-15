import * as z from 'zod'

export const UpdateAnalysisResponseSchema = z.object({
  id: z.uuid(),
  title: z.string(),
  description: z.string().nullable(),
  createdAt: z.string(),
  updatedAt: z.string()
})

export type UpdateAnalysisResponseDTO = z.infer<typeof UpdateAnalysisResponseSchema>
