import { defineContentConfig, defineCollection } from '@nuxt/content'
import { z } from 'zod'

const commonSchema = z.object({
  title: z.string().min(1),
  description: z.string().optional(),
  locale: z.string().min(2),
  updatedAt: z.string().min(4),
  version: z.string().min(1)
})

export default defineContentConfig({
  collections: {
    content_en: defineCollection({
      type: 'page',
      source: {
        include: 'en/**',
        prefix: ''
      },
      schema: commonSchema
    }),
    content_de: defineCollection({
      type: 'page',
      source: {
        include: 'de/**',
        prefix: ''
      },
      schema: commonSchema
    })
  }
})
