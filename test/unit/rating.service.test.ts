import { describe, it, expect, beforeEach, vi } from 'vitest'
import { RatingService } from '../../server/services/rating/rating.service'
import { RatingNotFoundError, UnauthorizedRatingAccessError } from '../../server/services/rating/rating.errors'
import type { RatingRepository } from '../../server/contracts/repositories/rating-repository'
import type { AlternativeRepository } from '../../server/contracts/repositories/alternative-repository'
import type { CriterionRepository } from '../../server/contracts/repositories/criterion-repository'
import type { Logger } from '../../server/contracts/logging/logger'
import type { AuthorizationService } from '../../server/contracts/security/authorization-service'
import type { Rating, Alternative, Criterion } from '../../generated/prisma/client'

describe('RatingService', () => {
  let service: RatingService
  let mockRatingRepository: RatingRepository
  let mockAlternativeRepository: AlternativeRepository
  let mockCriterionRepository: CriterionRepository
  let mockLogger: Logger
  let mockAuthorizationService: AuthorizationService

  const mockAlternative: Alternative = {
    id: 'alt-1',
    analysisId: 'analysis-123',
    name: 'Alternative A',
    createdAt: new Date(),
    updatedAt: new Date()
  } as Alternative

  const mockCriterion: Criterion = {
    id: 'crit-1',
    analysisId: 'analysis-123',
    name: 'Criterion A',
    weight: 50,
    createdAt: new Date(),
    updatedAt: new Date()
  } as Criterion

  const mockRating: Rating = {
    id: 'rating-1',
    alternativeId: 'alt-1',
    criterionId: 'crit-1',
    value: 8,
    analysisId: 'analysis-123',
    createdAt: new Date(),
    updatedAt: new Date()
  } as Rating

  beforeEach(() => {
    mockRatingRepository = {
      findRatingsByUserId: vi.fn(),
      upsertRatings: vi.fn()
    } as unknown as RatingRepository

    mockAlternativeRepository = {
      findAlternativesByUserId: vi.fn()
    } as unknown as AlternativeRepository

    mockCriterionRepository = {
      findCriteriaByUserId: vi.fn()
    } as unknown as CriterionRepository

    mockLogger = {
      debug: vi.fn(),
      info: vi.fn(),
      warn: vi.fn(),
      error: vi.fn()
    } as Logger

    mockAuthorizationService = {
      assertAuthorizedResult: vi.fn()
    } as unknown as AuthorizationService

    service = new RatingService(
      mockRatingRepository,
      mockAlternativeRepository,
      mockCriterionRepository,
      mockLogger,
      mockAuthorizationService
    )
  })

  describe('getRatings', () => {
    it('should fetch ratings snapshot successfully', async () => {
      const userId = 'user-123'
      const analysisId = 'analysis-123'

      vi.mocked(mockAlternativeRepository.findAlternativesByUserId).mockResolvedValue([mockAlternative])
      vi.mocked(mockCriterionRepository.findCriteriaByUserId).mockResolvedValue([mockCriterion])
      vi.mocked(mockRatingRepository.findRatingsByUserId).mockResolvedValue([mockRating])

      const result = await service.getRatings(userId, analysisId)

      expect(result.alternatives).toEqual([mockAlternative])
      expect(result.criteria).toEqual([mockCriterion])
      expect(result.ratings).toEqual([mockRating])
    })

    it('should return empty arrays when no data exists', async () => {
      const userId = 'user-123'
      const analysisId = 'analysis-123'

      vi.mocked(mockAlternativeRepository.findAlternativesByUserId).mockResolvedValue([])
      vi.mocked(mockCriterionRepository.findCriteriaByUserId).mockResolvedValue([])
      vi.mocked(mockRatingRepository.findRatingsByUserId).mockResolvedValue([])

      const result = await service.getRatings(userId, analysisId)

      expect(result.alternatives).toEqual([])
      expect(result.criteria).toEqual([])
      expect(result.ratings).toEqual([])
    })
  })

  describe('updateRatings', () => {
    it('should update ratings with valid references', async () => {
      const userId = 'user-123'
      const analysisId = 'analysis-123'
      const input = { ratings: [{ alternativeId: 'alt-1', criterionId: 'crit-1', score: 8 }] }

      vi.mocked(mockAlternativeRepository.findAlternativesByUserId).mockResolvedValue([mockAlternative])
      vi.mocked(mockCriterionRepository.findCriteriaByUserId).mockResolvedValue([mockCriterion])
      vi.mocked(mockRatingRepository.upsertRatings).mockResolvedValue([mockRating])

      const result = await service.updateRatings(userId, analysisId, input)

      expect(result).toEqual([mockRating])
      expect(mockAuthorizationService.assertAuthorizedResult).toHaveBeenCalled()
      expect(mockLogger.info).toHaveBeenCalledWith('Ratings updated successfully', {
        userId,
        analysisId,
        count: 1
      })
    })

    it('should throw RatingNotFoundError when alternative reference is invalid', async () => {
      const userId = 'user-123'
      const analysisId = 'analysis-123'
      const input = { ratings: [{ alternativeId: 'unknown-alt', criterionId: 'crit-1', score: 8 }] }

      vi.mocked(mockAlternativeRepository.findAlternativesByUserId).mockResolvedValue([mockAlternative])
      vi.mocked(mockCriterionRepository.findCriteriaByUserId).mockResolvedValue([mockCriterion])

      await expect(service.updateRatings(userId, analysisId, input)).rejects.toThrow(RatingNotFoundError)
    })

    it('should throw RatingNotFoundError when criterion reference is invalid', async () => {
      const userId = 'user-123'
      const analysisId = 'analysis-123'
      const input = { ratings: [{ alternativeId: 'alt-1', criterionId: 'unknown-crit', score: 8 }] }

      vi.mocked(mockAlternativeRepository.findAlternativesByUserId).mockResolvedValue([mockAlternative])
      vi.mocked(mockCriterionRepository.findCriteriaByUserId).mockResolvedValue([mockCriterion])

      await expect(service.updateRatings(userId, analysisId, input)).rejects.toThrow(RatingNotFoundError)
    })

    it('should throw UnauthorizedRatingAccessError when authorization fails', async () => {
      const userId = 'user-123'
      const analysisId = 'analysis-123'
      const input = { ratings: [{ alternativeId: 'alt-1', criterionId: 'crit-1', score: 8 }] }

      vi.mocked(mockAlternativeRepository.findAlternativesByUserId).mockResolvedValue([mockAlternative])
      vi.mocked(mockCriterionRepository.findCriteriaByUserId).mockResolvedValue([mockCriterion])
      vi.mocked(mockRatingRepository.upsertRatings).mockResolvedValue([mockRating])
      vi.mocked(mockAuthorizationService.assertAuthorizedResult).mockImplementation(() => {
        throw new UnauthorizedRatingAccessError()
      })

      await expect(service.updateRatings(userId, analysisId, input)).rejects.toThrow(
        UnauthorizedRatingAccessError
      )
    })
  })
})
