import { RatingNotFoundError, UnauthorizedRatingAccessError } from './rating.errors'
import type { UpdateRatingsBodyDTO } from '@server/api/schemas/ratings/update-ratings.body.schema'
import type { AlternativeRepository } from '@contracts/repositories/alternative-repository'
import type { CriterionRepository } from '@contracts/repositories/criterion-repository'
import type { RatingRepository } from '@contracts/repositories/rating-repository'
import type { Logger } from '@contracts/logging/logger'
import type { AuthorizationService } from '@contracts/security/authorization-service'
import type { Alternative, Criterion, Rating } from '@generated/prisma/client'

export interface RatingsSnapshot {
  alternatives: Alternative[]
  criteria: Criterion[]
  ratings: Rating[]
}

export class RatingService {
  constructor(
    private readonly ratingRepository: RatingRepository,
    private readonly alternativeRepository: AlternativeRepository,
    private readonly criterionRepository: CriterionRepository,
    private readonly logger: Logger,
    private readonly authorizationService: AuthorizationService
  ) {}

  async getRatings(userId: string, analysisId: string): Promise<RatingsSnapshot> {
    this.logger.debug('Fetching ratings', { userId, analysisId })

    const [alternatives, criteria, ratings] = await Promise.all([
      this.alternativeRepository.findAlternativesByUserId(userId, analysisId),
      this.criterionRepository.findCriteriaByUserId(userId, analysisId),
      this.ratingRepository.findRatingsByUserId(userId, analysisId)
    ])

    this.logger.debug('Ratings fetched successfully', {
      userId,
      analysisId,
      alternatives: alternatives.length,
      criteria: criteria.length,
      ratings: ratings.length
    })

    return { alternatives, criteria, ratings }
  }

  async updateRatings(
    userId: string,
    analysisId: string,
    input: UpdateRatingsBodyDTO
  ): Promise<Rating[]> {
    this.logger.debug('Updating ratings', {
      userId,
      analysisId,
      count: input.ratings.length
    })

    const [alternatives, criteria] = await Promise.all([
      this.alternativeRepository.findAlternativesByUserId(userId, analysisId),
      this.criterionRepository.findCriteriaByUserId(userId, analysisId)
    ])

    this.assertRatingReferences(userId, analysisId, alternatives, criteria, input)

    const updated = await this.ratingRepository.upsertRatings(
      userId,
      analysisId,
      input.ratings
    )

    this.authorizationService.assertAuthorizedResult(
      updated,
      'Unauthorized ratings operation',
      { userId, analysisId },
      new UnauthorizedRatingAccessError()
    )

    this.logger.info('Ratings updated successfully', {
      userId,
      analysisId,
      count: updated.length
    })

    return updated
  }

  private assertRatingReferences(
    userId: string,
    analysisId: string,
    alternatives: Alternative[],
    criteria: Criterion[],
    input: UpdateRatingsBodyDTO
  ): void {
    const alternativeIds = new Set(alternatives.map(alternative => alternative.id))
    const criterionIds = new Set(criteria.map(criterion => criterion.id))

    const invalidAlternativeIds = input.ratings
      .map(rating => rating.alternativeId)
      .filter(alternativeId => !alternativeIds.has(alternativeId))

    const invalidCriterionIds = input.ratings
      .map(rating => rating.criterionId)
      .filter(criterionId => !criterionIds.has(criterionId))

    if (invalidAlternativeIds.length > 0 || invalidCriterionIds.length > 0) {
      this.logger.warn('Ratings contain unknown references', {
        userId,
        analysisId,
        invalidAlternativeIds,
        invalidCriterionIds
      })
      throw new RatingNotFoundError()
    }
  }
}
