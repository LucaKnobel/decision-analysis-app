import * as z from 'zod'

export const GetContentQuerySchema = z.object({
  locale: z.enum(['en', 'de']).default('en')
})

export type GetContentQueryDTO = z.infer<typeof GetContentQuerySchema>
