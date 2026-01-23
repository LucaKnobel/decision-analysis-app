import { CreateAnalysisRequestSchema } from '@server/api/schemas/analysis/create-analysis.request.schema'
import { CreateAnalysisResponseSchema } from '@server/api/schemas/analysis/create-analysis.response.schema'
import { AnalysisService } from '@services/analyses/analysis.service'
import { analysisRepository } from '@infrastructure/repositories/analysis-repository.prisma'
import { logger } from '@infrastructure/logging/logger.pino'

export default defineEventHandler(async (event) => {
  const { user } = await requireUserSession(event)
  const dto = await readValidatedBody(event, CreateAnalysisRequestSchema.parse)
  try {
    const analysisService = new AnalysisService(analysisRepository, logger)
    const analysis = await analysisService.createAnalysis(user.id, dto)
    setResponseStatus(event, 201)
    return CreateAnalysisResponseSchema.parse({ id: analysis.id })
  } catch (error: unknown) {
    logger.error('Unexpected error during analysis creation', {}, error instanceof Error ? error : undefined)
    throw createError({
      statusCode: 500,
      message: 'Internal server error'
    })
  }
})
