import { CreateAnalysisBodySchema } from '@server/api/schemas/analyses/create-analysis.body.schema'
import { CreateAnalysisResponseSchema } from '@server/api/schemas/analyses/create-analysis.response.schema'
import { AnalysisService } from '@server/services/analysis/analysis.service'
import { analysisRepository } from '@infrastructure/repositories/analysis-repository.prisma'
import { logger } from '@infrastructure/logging/logger.pino'

export default defineEventHandler(async (event) => {
  const { user } = await requireUserSession(event)
  const dto = await readValidatedBody(event, CreateAnalysisBodySchema.parse)
  try {
    const analysisService = new AnalysisService(analysisRepository, logger)
    const analysis = await analysisService.createAnalysis(user.id, dto)
    setResponseStatus(event, 201)
    return CreateAnalysisResponseSchema.parse({ id: analysis.id })
  } catch (error: unknown) {
    logger.error('Unexpected error during analysis creation', {}, error instanceof Error ? error : undefined)
    throw createError({
      status: 500,
      statusText: 'Internal server error'
    })
  }
})
