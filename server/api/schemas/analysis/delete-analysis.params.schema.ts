import * as z from 'zod'

export const DeleteAnalysisParamsSchema = z.object({
  id: z.uuid('Invalid UUID')
})

export type DeleteAnalysisParamsDTO = z.infer<typeof DeleteAnalysisParamsSchema>
