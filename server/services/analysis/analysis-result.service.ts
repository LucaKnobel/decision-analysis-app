import type { AlternativeRepository } from '@contracts/repositories/alternative-repository'
import type { CriterionRepository } from '@contracts/repositories/criterion-repository'
import type { RatingRepository } from '@contracts/repositories/rating-repository'
import type { Logger } from '@contracts/logging/logger'
import type { GetResultsResponseDTO, ResultCriterionDTO, ResultItemDTO } from '@server/api/schemas/results/get-results.response.schema'
import { InvalidWeightSumError, MissingRatingsError } from './analysis-result.errors'

export class AnalysisResultService {
  constructor(
    private readonly alternativeRepository: AlternativeRepository,
    private readonly criterionRepository: CriterionRepository,
    private readonly ratingRepository: RatingRepository,
    private readonly logger: Logger
  ) {}

  async calculateResults(userId: string, analysisId: string): Promise<GetResultsResponseDTO> {
    this.logger.debug('Calculating analysis results', { userId, analysisId })

    // Load all inputs required for the calculation in parallel
    const { alternatives, criteria, ratings } = await this.fetchInputs(userId, analysisId)

    // Compute total weight to validate weighting consistency
    const weightSum = this.sumWeights(criteria)
    this.ensureWeightsValid(userId, analysisId, weightSum)

    // Normalize weights so their total equals 1 (required for weighted scoring)
    const normalizedWeights = this.createNormalizedWeights(criteria, weightSum)

    // Prepare a DTO-friendly summary of criteria for the response
    const criteriaSummary = this.createCriteriaSummary(criteria, normalizedWeights)

    // Build a fast lookup map: "alternativeId:criterionId" ===> rating
    const ratingIndex = this.indexRatings(ratings)

    // Strict mode: require a complete ratings matrix before calculation.
    this.ensureAllRatingsPresent(userId, analysisId, alternatives, criteria, ratingIndex)

    // Build result items (one per alternative) with detailed contributions
    const results = this.buildResultItems(alternatives, criteria, normalizedWeights, ratingIndex)
    // Sort by score and assign ranking positions
    const rankedResults = this.rankResults(results)

    this.logger.info('Analysis results calculated successfully', {
      userId,
      analysisId,
      alternatives: alternatives.length,
      criteria: criteria.length,
      ratings: ratings.length
    })

    return {
      alternatives: alternatives.map(alternative => ({
        id: alternative.id,
        name: alternative.name
      })),
      criteria: criteriaSummary,
      weightSum,
      results: rankedResults
    }
  }

  private async fetchInputs(userId: string, analysisId: string) {
    // Fetch domain data needed for the scoring model
    const [alternatives, criteria, ratings] = await Promise.all([
      this.alternativeRepository.findAlternativesByUserId(userId, analysisId),
      this.criterionRepository.findCriteriaByUserId(userId, analysisId),
      this.ratingRepository.findRatingsByUserId(userId, analysisId)
    ])

    return { alternatives, criteria, ratings }
  }

  private sumWeights(criteria: Array<{ weight: number }>): number {
    // Sum of all criterion weights (must equal 100)
    return criteria.reduce((sum, criterion) => sum + criterion.weight, 0)
  }

  private ensureWeightsValid(userId: string, analysisId: string, weightSum: number): void {
    // Business rule: the model requires a full 100% weight distribution
    if (weightSum !== 100) {
      this.logger.warn('Invalid criteria weight sum', { userId, analysisId, weightSum })
      throw new InvalidWeightSumError()
    }
  }

  private createNormalizedWeights(
    criteria: Array<{ id: string, weight: number }>,
    weightSum: number
  ): Map<string, number> {
    // Convert absolute weights (e.g. 40) into ratios (0.4)
    return new Map(
      criteria.map(criterion => [
        criterion.id,
        weightSum > 0 ? criterion.weight / weightSum : 0
      ])
    )
  }

  private createCriteriaSummary(
    criteria: Array<{ id: string, name: string, weight: number }>,
    normalizedWeights: Map<string, number>
  ): ResultCriterionDTO[] {
    // Prepare criteria information for UI (original + normalized weight)
    return criteria.map(criterion => ({
      id: criterion.id,
      name: criterion.name,
      weight: criterion.weight,
      normalizedWeight: normalizedWeights.get(criterion.id) ?? 0
    }))
  }

  private indexRatings(ratings: Array<{ alternativeId: string, criterionId: string, value: number }>): Map<string, number> {
    return new Map(
    // Create a lookup table to access ratings in O(1) time
      ratings.map(rating => [
        `${rating.alternativeId}:${rating.criterionId}`,
        rating.value
      ])
    )
  }

  private buildResultItems(
    alternatives: Array<{ id: string, name: string }>,
    criteria: Array<{ id: string, weight: number }>,
    normalizedWeights: Map<string, number>,
    ratingIndex: Map<string, number>
  ): ResultItemDTO[] {
    return alternatives.map((alternative) => {
    // Each alternative gets its own result object
      const contributions = this.buildContributions(
        alternative,
        criteria,
        normalizedWeights,
        ratingIndex
      )

      // Total score is the sum of all weighted contributions
      const totalScore = contributions.reduce((sum, contribution) => sum + contribution.weightedScore, 0)

      return {
        alternativeId: alternative.id,
        alternativeName: alternative.name,
        totalScore,
        rank: 0, // ranking assigned later
        contributions
      }
    })
  }

  private buildContributions(
    alternative: { id: string },
    criteria: Array<{ id: string, weight: number }>,
    normalizedWeights: Map<string, number>,
    ratingIndex: Map<string, number>
  ) {
    // For each criterion compute its contribution to the alternative's score
    return criteria.map((criterion) => {
      const rating = this.getRatingValue(alternative.id, criterion.id, ratingIndex)
      const normalizedWeight = normalizedWeights.get(criterion.id) ?? 0
      // Core weighted scoring formula
      const weightedScore = rating * normalizedWeight

      return {
        criterionId: criterion.id,
        rating,
        weight: criterion.weight,
        normalizedWeight,
        weightedScore
      }
    })
  }

  private getRatingValue(
    alternativeId: string,
    criterionId: string,
    ratingIndex: Map<string, number>
  ): number {
    const key = `${alternativeId}:${criterionId}`
    const rating = ratingIndex.get(key)

    // In strict mode every cell must exist
    if (rating === undefined) {
      throw new MissingRatingsError()
    }
    return rating
  }

  private ensureAllRatingsPresent(
    userId: string,
    analysisId: string,
    alternatives: Array<{ id: string }>,
    criteria: Array<{ id: string }>,
    ratingIndex: Map<string, number>
  ): void {
    // Expected size of the rating matrix
    const expected = alternatives.length * criteria.length
    if (expected === 0) {
      return
    }

    // Quick size check first
    if (ratingIndex.size !== expected) {
      this.logger.warn('Missing ratings for analysis', {
        userId,
        analysisId,
        expected,
        actual: ratingIndex.size
      })
      throw new MissingRatingsError()
    }

    // Verify every combination explicitly (safety check)
    for (const alternative of alternatives) {
      for (const criterion of criteria) {
        const key = `${alternative.id}:${criterion.id}`
        if (!ratingIndex.has(key)) {
          this.logger.warn('Missing rating entry', {
            userId,
            analysisId,
            alternativeId: alternative.id,
            criterionId: criterion.id
          })
          throw new MissingRatingsError()
        }
      }
    }
  }

  private rankResults(results: ResultItemDTO[]): ResultItemDTO[] {
    // Sort by score descending, then by name for deterministic ordering
    return [...results]
      .sort((first, second) => {
        if (second.totalScore !== first.totalScore) {
          return second.totalScore - first.totalScore
        }

        const nameOrder = first.alternativeName.localeCompare(second.alternativeName)
        if (nameOrder !== 0) {
          return nameOrder
        }

        return first.alternativeId.localeCompare(second.alternativeId)
      })
      .map((result, index) => ({
        ...result,
        rank: index + 1
      }))
  }
}
