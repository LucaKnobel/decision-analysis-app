import * as z from 'zod'

export const GetAnalysesRequestSchema = z.object({
  page: z.coerce.number()
    .int('Page must be an integer')
    .min(1, 'Page must be at least 1')
    .default(1),
  limit: z.coerce.number()
    .int('Limit must be an integer')
    .min(1, 'Limit must be at least 1')
    .max(100, 'Limit must not exceed 100')
    .default(20),
  sortBy: z.enum(['createdAt', 'updatedAt', 'title'])
    .optional()
    .default('createdAt'),
  sortOrder: z.enum(['asc', 'desc'])
    .optional()
    .default('desc'),
  search: z.string()
    .trim()
    .min(1, 'Search must not be empty')
    .max(100, 'Search must not exceed 100 characters')
    .optional()
})

export type GetAnalysesRequestDTO = z.infer<typeof GetAnalysesRequestSchema>
