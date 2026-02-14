import * as z from 'zod'

export const GetAnalysisResponseSchema = z.object({
  id: z.uuid(),
  title: z.string(),
  description: z.string().nullable(),
  createdAt: z.string(),
  updatedAt: z.string()
})

export type GetAnalysisResponseDTO = z.infer<typeof GetAnalysisResponseSchema>
