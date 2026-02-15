import * as z from 'zod'

export const CreateAnalysisResponseSchema = z.object({
  id: z.uuid()
})

export type CreateAnalysisResponseDTO = z.infer<typeof CreateAnalysisResponseSchema>
