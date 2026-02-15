import { AnalysisIdParamsSchema } from '@server/api/schemas/analyses/analysis-id.params.schema'
import { GetRatingsResponseSchema } from '@server/api/schemas/ratings/get-ratings.response.schema'
import { AnalysisService } from '@services/analysis/analysis.service'
import { AnalysisNotFoundError, UnauthorizedAnalysisAccessError } from '@services/analysis/analysis.errors'
import { RatingService } from '@services/rating/rating.service'
import { ratingRepository } from '@infrastructure/repositories/rating-repository.prisma'
import { alternativeRepository } from '@infrastructure/repositories/alternative-repository.prisma'
import { criterionRepository } from '@infrastructure/repositories/criterion-repository.prisma'
import { analysisRepository } from '@infrastructure/repositories/analysis-repository.prisma'
import { logger } from '@infrastructure/logging/logger.pino'
import { DefaultAuthorizationService } from '@services/common/authorization.service'

export default defineEventHandler(async (event) => {
  const { user } = await requireUserSession(event)
  const params = AnalysisIdParamsSchema.parse({
    id: getRouterParam(event, 'id')
  })

  try {
    const analysisService = new AnalysisService(analysisRepository, logger)
    await analysisService.getAnalysisById(params.id, user.id)

    const authorizationService = new DefaultAuthorizationService(logger)
    const ratingService = new RatingService(
      ratingRepository,
      alternativeRepository,
      criterionRepository,
      logger,
      authorizationService
    )

    const response = await ratingService.getRatings(user.id, params.id)

    return GetRatingsResponseSchema.parse(response)
  } catch (error: unknown) {
    if (error instanceof AnalysisNotFoundError || error instanceof UnauthorizedAnalysisAccessError) {
      throw createError({ status: 404, statusText: 'Analysis not found' })
    }

    logger.error('Unexpected error during ratings fetch', {}, error instanceof Error ? error : undefined)
    throw createError({
      status: 500,
      statusText: 'Internal server error'
    })
  }
})
