import * as z from 'zod'

export const CreateAnalysisRequestSchema = z.object({
  title: z.string()
    .min(1, 'Title is required')
    .max(100, 'Title must not exceed 100 characters'),
  description: z.string()
    .max(500, 'Description must not exceed 500 characters')
    .optional()
})

export type CreateAnalysisRequestDTO = z.infer<typeof CreateAnalysisRequestSchema>
