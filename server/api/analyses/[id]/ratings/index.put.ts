import { AnalysisIdParamsSchema } from '@server/api/schemas/analyses/analysis-id.params.schema'
import { UpdateRatingsBodySchema } from '@server/api/schemas/ratings/update-ratings.body.schema'
import { UpdateRatingsResponseSchema } from '@server/api/schemas/ratings/update-ratings.response.schema'
import { AnalysisService } from '@services/analysis/analysis.service'
import { AnalysisNotFoundError, UnauthorizedAnalysisAccessError } from '@services/analysis/analysis.errors'
import { RatingNotFoundError, UnauthorizedRatingAccessError } from '@services/rating/rating.errors'
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
  const dto = await readValidatedBody(event, UpdateRatingsBodySchema.parse)

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

    const ratings = await ratingService.updateRatings(user.id, params.id, dto)

    return UpdateRatingsResponseSchema.parse({ data: ratings })
  } catch (error: unknown) {
    if (error instanceof AnalysisNotFoundError || error instanceof UnauthorizedAnalysisAccessError) {
      throw createError({ status: 404, statusText: 'Analysis not found' })
    }

    if (error instanceof RatingNotFoundError || error instanceof UnauthorizedRatingAccessError) {
      throw createError({ status: 404, statusText: 'Ratings not found' })
    }

    logger.error('Unexpected error during ratings update', {}, error instanceof Error ? error : undefined)
    throw createError({
      status: 500,
      statusText: 'Internal server error'
    })
  }
})
