import { DeleteAnalysisParamsSchema } from '@server/api/schemas/analysis/delete-analysis.params.schema'
import { AnalysisService } from '@services/analyses/analysis.service'
import { analysisRepository } from '@infrastructure/repositories/analysis-repository.prisma'
import { logger } from '@infrastructure/logging/logger.pino'
import { AnalysisNotFoundError, UnauthorizedAnalysisAccessError } from '~~/server/services/analyses/analysis.errors'

export default defineEventHandler(async (event) => {
  const { user } = await requireUserSession(event)
  const params = DeleteAnalysisParamsSchema.parse({
    id: getRouterParam(event, 'id')
  })
  try {
    const analysisService = new AnalysisService(analysisRepository, logger)
    await analysisService.deleteAnalysis(params.id, user.id)
    setResponseStatus(event, 204)
  } catch (error: unknown) {
    if (error instanceof AnalysisNotFoundError || error instanceof UnauthorizedAnalysisAccessError) {
      throw createError({ status: 404, statusText: 'Analysis not found' })
    }

    logger.error('Unhandled error during analysis deletion', {}, error instanceof Error ? error : undefined)
    throw createError({ status: 500, statusText: 'Internal server error' })
  }
})
