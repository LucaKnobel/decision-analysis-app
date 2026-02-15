import { describe, it, expect, beforeEach, vi } from 'vitest'
import { CriterionService } from '../../server/services/criterion/criterion.service'
import { CriterionNotFoundError, UnauthorizedCriterionAccessError } from '../../server/services/criterion/criterion.errors'
import type { CriterionRepository } from '../../server/contracts/repositories/criterion-repository'
import type { Logger } from '../../server/contracts/logging/logger'
import type { AuthorizationService } from '../../server/contracts/security/authorization-service'
import type { Criterion } from '../../generated/prisma/client'

describe('CriterionService', () => {
  let service: CriterionService
  let mockRepository: CriterionRepository
  let mockLogger: Logger
  let mockAuthorizationService: AuthorizationService

  const mockCriterion: Criterion = {
    id: 'crit-1',
    analysisId: 'analysis-123',
    name: 'Criterion A',
    weight: 50,
    createdAt: new Date(),
    updatedAt: new Date()
  } as Criterion

  beforeEach(() => {
    mockRepository = {
      createCriteria: vi.fn(),
      findCriteriaByUserId: vi.fn(),
      updateCriterion: vi.fn(),
      deleteCriterion: vi.fn(),
      replaceCriteria: vi.fn()
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

    service = new CriterionService(mockRepository, mockLogger, mockAuthorizationService)
  })

  describe('createCriteria', () => {
    it('should create criteria with authorization check', async () => {
      const userId = 'user-123'
      const analysisId = 'analysis-123'
      const input = { criteria: [{ name: 'Criterion A', weight: 50 }] }

      vi.mocked(mockRepository.createCriteria).mockResolvedValue([mockCriterion])

      const result = await service.createCriteria(userId, analysisId, input)

      expect(result).toEqual([mockCriterion])
      expect(mockAuthorizationService.assertAuthorizedResult).toHaveBeenCalled()
      expect(mockLogger.info).toHaveBeenCalledWith('Criteria created successfully', {
        userId,
        analysisId,
        count: 1
      })
    })

    it('should throw UnauthorizedCriterionAccessError when authorization fails', async () => {
      const userId = 'user-123'
      const analysisId = 'analysis-123'
      const input = { criteria: [{ name: 'Criterion A', weight: 50 }] }

      vi.mocked(mockRepository.createCriteria).mockResolvedValue([mockCriterion])
      vi.mocked(mockAuthorizationService.assertAuthorizedResult).mockImplementation(() => {
        throw new UnauthorizedCriterionAccessError()
      })

      await expect(service.createCriteria(userId, analysisId, input)).rejects.toThrow(
        UnauthorizedCriterionAccessError
      )
    })
  })

  describe('getCriteria', () => {
    it('should fetch criteria successfully', async () => {
      const userId = 'user-123'
      const analysisId = 'analysis-123'

      vi.mocked(mockRepository.findCriteriaByUserId).mockResolvedValue([mockCriterion])

      const result = await service.getCriteria(userId, analysisId)

      expect(result).toEqual([mockCriterion])
      expect(mockRepository.findCriteriaByUserId).toHaveBeenCalledWith(userId, analysisId)
    })

    it('should return empty array when no criteria exist', async () => {
      const userId = 'user-123'
      const analysisId = 'analysis-123'

      vi.mocked(mockRepository.findCriteriaByUserId).mockResolvedValue([])

      const result = await service.getCriteria(userId, analysisId)

      expect(result).toEqual([])
    })
  })

  describe('updateCriterion', () => {
    it('should update criterion successfully', async () => {
      const userId = 'user-123'
      const analysisId = 'analysis-123'
      const criterionId = 'crit-1'

      vi.mocked(mockRepository.updateCriterion).mockResolvedValue(mockCriterion)

      const result = await service.updateCriterion(userId, analysisId, criterionId, 'Updated Criterion', 60)

      expect(result).toEqual(mockCriterion)
      expect(mockLogger.info).toHaveBeenCalledWith('Criterion updated successfully', {
        userId,
        analysisId,
        criterionId
      })
    })

    it('should throw CriterionNotFoundError when criterion not found', async () => {
      const userId = 'user-123'
      const analysisId = 'analysis-123'
      const criterionId = 'unknown-id'

      vi.mocked(mockRepository.updateCriterion).mockResolvedValue(null)

      await expect(
        service.updateCriterion(userId, analysisId, criterionId, 'Updated Criterion', 60)
      ).rejects.toThrow(CriterionNotFoundError)
    })
  })

  describe('deleteCriterion', () => {
    it('should delete criterion successfully', async () => {
      const userId = 'user-123'
      const analysisId = 'analysis-123'
      const criterionId = 'crit-1'

      vi.mocked(mockRepository.deleteCriterion).mockResolvedValue(true)

      await service.deleteCriterion(userId, analysisId, criterionId)

      expect(mockRepository.deleteCriterion).toHaveBeenCalledWith(userId, analysisId, criterionId)
      expect(mockLogger.info).toHaveBeenCalledWith('Criterion deleted successfully', {
        userId,
        analysisId,
        criterionId
      })
    })

    it('should throw CriterionNotFoundError when criterion not found', async () => {
      const userId = 'user-123'
      const analysisId = 'analysis-123'
      const criterionId = 'unknown-id'

      vi.mocked(mockRepository.deleteCriterion).mockResolvedValue(false)

      await expect(service.deleteCriterion(userId, analysisId, criterionId)).rejects.toThrow(
        CriterionNotFoundError
      )
    })
  })

  describe('replaceCriteria', () => {
    it('should replace criteria with valid IDs', async () => {
      const userId = 'user-123'
      const analysisId = 'analysis-123'
      const input = { criteria: [{ id: 'crit-1', name: 'Updated Criterion', weight: 60 }] }

      vi.mocked(mockRepository.findCriteriaByUserId).mockResolvedValue([mockCriterion])
      vi.mocked(mockRepository.replaceCriteria).mockResolvedValue([{ ...mockCriterion, weight: 60 }])

      const result = await service.replaceCriteria(userId, analysisId, input)

      expect(result[0].weight).toBe(60)
      expect(mockLogger.info).toHaveBeenCalledWith('Criteria replaced successfully', {
        userId,
        analysisId,
        count: 1
      })
    })

    it('should throw CriterionNotFoundError when replacing unknown criteria', async () => {
      const userId = 'user-123'
      const analysisId = 'analysis-123'
      const input = { criteria: [{ id: 'unknown-id', name: 'Criterion', weight: 50 }] }

      vi.mocked(mockRepository.findCriteriaByUserId).mockResolvedValue([mockCriterion])

      await expect(service.replaceCriteria(userId, analysisId, input)).rejects.toThrow(
        CriterionNotFoundError
      )
    })
  })
})
