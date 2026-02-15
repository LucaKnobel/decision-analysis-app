import { withLeadingSlash } from 'ufo'
import { GetContentParamsSchema } from '@server/api/schemas/content/get-content.params.schema'
import { GetContentQuerySchema } from '@server/api/schemas/content/get-content.query.schema'
import { queryCollection } from '@nuxt/content/server'

export default defineEventHandler(async (event) => {
  const queryDto = await getValidatedQuery(event, GetContentQuerySchema.parse)
  const params = GetContentParamsSchema.parse({
    slug: getRouterParam(event, 'slug')
  })
  const slug = withLeadingSlash(params.slug)
  let content = await queryCollection(event, `content_${queryDto.locale}`).path(slug).first()

  if (!content && queryDto.locale !== 'en') {
    content = await queryCollection(event, 'content_en')
      .path(slug)
      .first()
  }

  if (!content) {
    throw createError({ status: 404, statusText: 'Content not found' })
  }

  return content
})
