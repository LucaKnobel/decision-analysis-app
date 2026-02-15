import * as z from 'zod'

export const AnalysisIdParamsSchema = z.object({
  id: z.uuid('Invalid UUID')
})

export type AnalysisIdParamsDTO = z.infer<typeof AnalysisIdParamsSchema>
