import { GetAnalysesQuerySchema } from '@server/api/schemas/analysis/get-analyses.query.schema'
import { GetAnalysesResponseSchema } from '@server/api/schemas/analysis/get-analyses.response.schema'
import { AnalysisService } from '@services/analyses/analysis.service'
import { analysisRepository } from '@infrastructure/repositories/analysis-repository.prisma'
import { logger } from '@infrastructure/logging/logger.pino'

export default defineEventHandler(async (event) => {
  const { user } = await requireUserSession(event)
  const queryDto = await getValidatedQuery(event, GetAnalysesQuerySchema.parse)
  try {
    const analysisService = new AnalysisService(analysisRepository, logger)
    const analyses = await analysisService.getAnalysesPaginated(user.id, queryDto)
    setResponseStatus(event, 200)
    return GetAnalysesResponseSchema.parse(analyses)
  } catch (error: unknown) {
    logger.error('Unexpected error during analysis creation', {}, error instanceof Error ? error : undefined)
    throw createError({
      status: 500,
      statusText: 'Internal server error'
    })
  }
})
