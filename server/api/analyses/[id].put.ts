import { AnalysisIdParamsSchema } from '@server/api/schemas/analyses/analysis-id.params.schema'
import { CreateAnalysisBodySchema } from '@server/api/schemas/analyses/create-analysis.body.schema'
import { UpdateAnalysisResponseSchema } from '@server/api/schemas/analyses/update-analysis.response.schema'
import { AnalysisService } from '@services/analysis/analysis.service'
import { AnalysisNotFoundError, UnauthorizedAnalysisAccessError } from '@services/analysis/analysis.errors'
import { analysisRepository } from '@infrastructure/repositories/analysis-repository.prisma'
import { logger } from '@infrastructure/logging/logger.pino'

export default defineEventHandler(async (event) => {
  const { user } = await requireUserSession(event)
  const params = AnalysisIdParamsSchema.parse({
    id: getRouterParam(event, 'id')
  })
  const dto = await readValidatedBody(event, CreateAnalysisBodySchema.parse)

  try {
    const analysisService = new AnalysisService(analysisRepository, logger)
    const analysis = await analysisService.updateAnalysis(params.id, user.id, dto)

    return UpdateAnalysisResponseSchema.parse({
      id: analysis.id,
      title: analysis.title,
      description: analysis.description,
      createdAt: analysis.createdAt.toISOString(),
      updatedAt: analysis.updatedAt.toISOString()
    })
  } catch (error: unknown) {
    if (error instanceof AnalysisNotFoundError || error instanceof UnauthorizedAnalysisAccessError) {
      throw createError({ status: 404, statusText: 'Analysis not found' })
    }

    logger.error('Unexpected error during analysis update', {}, error instanceof Error ? error : undefined)
    throw createError({
      status: 500,
      statusText: 'Internal server error'
    })
  }
})
