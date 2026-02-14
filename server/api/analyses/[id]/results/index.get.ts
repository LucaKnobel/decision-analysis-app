import { AnalysisIdParamsSchema } from '@server/api/schemas/analyses/analysis-id.params.schema'
import { GetResultsResponseSchema } from '@server/api/schemas/results/get-results.response.schema'
import { AnalysisService } from '@services/analysis/analysis.service'
import { AnalysisNotFoundError, UnauthorizedAnalysisAccessError } from '@services/analysis/analysis.errors'
import { AnalysisResultService } from '@services/analysis/analysis-result.service'
import { InvalidWeightSumError, MissingRatingsError } from '@services/analysis/analysis-result.errors'
import { analysisRepository } from '@infrastructure/repositories/analysis-repository.prisma'
import { alternativeRepository } from '@infrastructure/repositories/alternative-repository.prisma'
import { criterionRepository } from '@infrastructure/repositories/criterion-repository.prisma'
import { ratingRepository } from '@infrastructure/repositories/rating-repository.prisma'
import { logger } from '@infrastructure/logging/logger.pino'

export default defineEventHandler(async (event) => {
  const { user } = await requireUserSession(event)
  const params = AnalysisIdParamsSchema.parse({
    id: getRouterParam(event, 'id')
  })

  try {
    const analysisService = new AnalysisService(analysisRepository, logger)
    await analysisService.getAnalysisById(params.id, user.id)

    const analysisResultService = new AnalysisResultService(
      alternativeRepository,
      criterionRepository,
      ratingRepository,
      logger
    )

    const response = await analysisResultService.calculateResults(user.id, params.id)
    return GetResultsResponseSchema.parse(response)
  } catch (error: unknown) {
    if (error instanceof AnalysisNotFoundError || error instanceof UnauthorizedAnalysisAccessError) {
      throw createError({ status: 404, statusText: 'Analysis not found' })
    }

    if (error instanceof InvalidWeightSumError) {
      throw createError({ status: 422, statusText: 'Criteria weights must sum to 100' })
    }

    if (error instanceof MissingRatingsError) {
      throw createError({ status: 409, statusText: 'Ratings incomplete' })
    }

    logger.error('Unexpected error during results calculation', {}, error instanceof Error ? error : undefined)
    throw createError({
      status: 500,
      statusText: 'Internal server error'
    })
  }
})
