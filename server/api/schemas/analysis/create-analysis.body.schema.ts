import * as z from 'zod'

export const CreateAnalysisBodySchema = z.object({
  title: z.string()
    .trim()
    .min(1, 'Title is required')
    .max(100, 'Title must not exceed 100 characters'),
  description: z.string()
    .max(500, 'Description must not exceed 500 characters')
    .optional()
})

export type CreateAnalysisBodyDTO = z.infer<typeof CreateAnalysisBodySchema>
