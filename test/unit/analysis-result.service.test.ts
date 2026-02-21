// TC-ID: TC-UT-07
import { describe, it, expect, beforeEach, vi } from 'vitest'
import { AnalysisResultService } from '../../server/services/analysis/analysis-result.service'
import { InvalidWeightSumError, MissingRatingsError } from '../../server/services/analysis/analysis-result.errors'
import type { AlternativeRepository } from '../../server/contracts/repositories/alternative-repository'
import type { CriterionRepository } from '../../server/contracts/repositories/criterion-repository'
import type { RatingRepository } from '../../server/contracts/repositories/rating-repository'
import type { Logger } from '../../server/contracts/logging/logger'
import type { Alternative, Criterion, Rating } from '../../generated/prisma/client'

describe('AnalysisResultService', () => {
  let service: AnalysisResultService
  let mockAlternativeRepository: AlternativeRepository
  let mockCriterionRepository: CriterionRepository
  let mockRatingRepository: RatingRepository
  let mockLogger: Logger

  const mockAlternatives: Alternative[] = [
    {
      id: 'alt-1',
      analysisId: 'analysis-123',
      name: 'Alternative A',
      createdAt: new Date(),
      updatedAt: new Date()
    } as Alternative,
    {
      id: 'alt-2',
      analysisId: 'analysis-123',
      name: 'Alternative B',
      createdAt: new Date(),
      updatedAt: new Date()
    } as Alternative
  ]

  const mockCriteria: Criterion[] = [
    {
      id: 'crit-1',
      analysisId: 'analysis-123',
      name: 'Cost',
      weight: 50,
      createdAt: new Date(),
      updatedAt: new Date()
    } as Criterion,
    {
      id: 'crit-2',
      analysisId: 'analysis-123',
      name: 'Quality',
      weight: 50,
      createdAt: new Date(),
      updatedAt: new Date()
    } as Criterion
  ]

  const mockRatings: Rating[] = [
    {
      id: 'rating-1',
      alternativeId: 'alt-1',
      criterionId: 'crit-1',
      value: 5,
      analysisId: 'analysis-123',
      createdAt: new Date(),
      updatedAt: new Date()
    } as Rating,
    {
      id: 'rating-2',
      alternativeId: 'alt-1',
      criterionId: 'crit-2',
      value: 4,
      analysisId: 'analysis-123',
      createdAt: new Date(),
      updatedAt: new Date()
    } as Rating,
    {
      id: 'rating-3',
      alternativeId: 'alt-2',
      criterionId: 'crit-1',
      value: 3,
      analysisId: 'analysis-123',
      createdAt: new Date(),
      updatedAt: new Date()
    } as Rating,
    {
      id: 'rating-4',
      alternativeId: 'alt-2',
      criterionId: 'crit-2',
      value: 4,
      analysisId: 'analysis-123',
      createdAt: new Date(),
      updatedAt: new Date()
    } as Rating
  ]

  beforeEach(() => {
    mockAlternativeRepository = {
      findAlternativesByUserId: vi.fn()
    } as unknown as AlternativeRepository

    mockCriterionRepository = {
      findCriteriaByUserId: vi.fn()
    } as unknown as CriterionRepository

    mockRatingRepository = {
      findRatingsByUserId: vi.fn()
    } as unknown as RatingRepository

    mockLogger = {
      debug: vi.fn(),
      info: vi.fn(),
      warn: vi.fn(),
      error: vi.fn()
    } as Logger

    service = new AnalysisResultService(
      mockAlternativeRepository,
      mockCriterionRepository,
      mockRatingRepository,
      mockLogger
    )
  })

  describe('calculateResults', () => {
    it('should calculate results with valid complete data', async () => {
      const userId = 'user-123'
      const analysisId = 'analysis-123'

      vi.mocked(mockAlternativeRepository.findAlternativesByUserId).mockResolvedValue(mockAlternatives)
      vi.mocked(mockCriterionRepository.findCriteriaByUserId).mockResolvedValue(mockCriteria)
      vi.mocked(mockRatingRepository.findRatingsByUserId).mockResolvedValue(mockRatings)

      const result = await service.calculateResults(userId, analysisId)

      expect(result.alternatives).toHaveLength(2)
      expect(result.criteria).toHaveLength(2)
      expect(result.results).toHaveLength(2)
      expect(result.weightSum).toBe(100)
      // Check that results are ranked
      expect(result.results[0].rank).toBe(1)
      expect(result.results[1].rank).toBe(2)
    })

    it('should throw InvalidWeightSumError when criteria weights do not sum to 100', async () => {
      const userId = 'user-123'
      const analysisId = 'analysis-123'
      const invalidCriteria = [
        { ...mockCriteria[0], weight: 40 },
        { ...mockCriteria[1], weight: 40 }
      ]

      vi.mocked(mockAlternativeRepository.findAlternativesByUserId).mockResolvedValue(mockAlternatives)
      vi.mocked(mockCriterionRepository.findCriteriaByUserId).mockResolvedValue(invalidCriteria)

      await expect(service.calculateResults(userId, analysisId)).rejects.toThrow(InvalidWeightSumError)
    })

    it('should throw MissingRatingsError when ratings matrix is incomplete', async () => {
      const userId = 'user-123'
      const analysisId = 'analysis-123'
      const incompleteRatings = mockRatings.slice(0, 2) // Only 2 ratings instead of 4

      vi.mocked(mockAlternativeRepository.findAlternativesByUserId).mockResolvedValue(mockAlternatives)
      vi.mocked(mockCriterionRepository.findCriteriaByUserId).mockResolvedValue(mockCriteria)
      vi.mocked(mockRatingRepository.findRatingsByUserId).mockResolvedValue(incompleteRatings)

      await expect(service.calculateResults(userId, analysisId)).rejects.toThrow(MissingRatingsError)
    })

    it('should rank results correctly by score', async () => {
      const userId = 'user-123'
      const analysisId = 'analysis-123'

      vi.mocked(mockAlternativeRepository.findAlternativesByUserId).mockResolvedValue(mockAlternatives)
      vi.mocked(mockCriterionRepository.findCriteriaByUserId).mockResolvedValue(mockCriteria)
      vi.mocked(mockRatingRepository.findRatingsByUserId).mockResolvedValue(mockRatings)

      const result = await service.calculateResults(userId, analysisId)

      // Alternative A should score higher
      expect(result.results[0].alternativeId).toBe('alt-1')
      expect(result.results[0].rank).toBe(1)
      expect(result.results[1].alternativeId).toBe('alt-2')
      expect(result.results[1].rank).toBe(2)
    })

    it('should handle empty alternatives gracefully', async () => {
      const userId = 'user-123'
      const analysisId = 'analysis-123'

      vi.mocked(mockAlternativeRepository.findAlternativesByUserId).mockResolvedValue([])
      vi.mocked(mockCriterionRepository.findCriteriaByUserId).mockResolvedValue(mockCriteria)
      vi.mocked(mockRatingRepository.findRatingsByUserId).mockResolvedValue([])

      const result = await service.calculateResults(userId, analysisId)

      expect(result.alternatives).toHaveLength(0)
      expect(result.results).toHaveLength(0)
    })
  })
})
