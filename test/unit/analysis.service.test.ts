// TC-ID: TC-UT-03
import { describe, it, expect, beforeEach, vi } from 'vitest'
import { AnalysisService } from '../../server/services/analysis/analysis.service'
import { AnalysisNotFoundError, UnauthorizedAnalysisAccessError } from '../../server/services/analysis/analysis.errors'
import type { AnalysisRepository } from '../../server/contracts/repositories/analysis-repository'
import type { Logger } from '../../server/contracts/logging/logger'
import type { AnalysisItemDTO } from '../../shared/types/analysis'

describe('AnalysisService', () => {
  let service: AnalysisService
  let mockRepository: AnalysisRepository
  let mockLogger: Logger

  const mockAnalysis: AnalysisItemDTO = {
    id: 'a1b2c3d4-e5f6-7890-abcd-ef1234567890',
    userId: 'user-123',
    title: 'Test Analysis',
    description: 'Test Description',
    createdAt: new Date('2024-01-01T00:00:00.000Z'),
    updatedAt: new Date('2024-01-01T00:00:00.000Z')
  }

  beforeEach(() => {
    mockRepository = {
      createAnalysis: vi.fn(),
      findAnalysesByUserId: vi.fn(),
      countAnalysesByUserId: vi.fn(),
      getAnalysisById: vi.fn(),
      updateAnalysis: vi.fn(),
      deleteAnalysis: vi.fn()
    } as AnalysisRepository

    mockLogger = {
      debug: vi.fn(),
      info: vi.fn(),
      warn: vi.fn(),
      error: vi.fn()
    } as Logger

    service = new AnalysisService(mockRepository, mockLogger)
  })

  describe('createAnalysis', () => {
    it('should create an analysis with title and description', async () => {
      const input = {
        title: 'New Analysis',
        description: 'New Description'
      }
      const userId = 'user-123'

      vi.mocked(mockRepository.createAnalysis).mockResolvedValue(mockAnalysis)

      const result = await service.createAnalysis(userId, input)

      expect(result).toEqual(mockAnalysis)
      expect(mockRepository.createAnalysis).toHaveBeenCalledWith({
        userId,
        title: input.title,
        description: input.description
      })
    })

    it('should create analysis without description', async () => {
      const input = {
        title: 'New Analysis'
      }
      const userId = 'user-123'

      vi.mocked(mockRepository.createAnalysis).mockResolvedValue(mockAnalysis)

      await service.createAnalysis(userId, input)

      expect(mockRepository.createAnalysis).toHaveBeenCalledWith({
        userId,
        title: input.title,
        description: null
      })
    })
  })

  describe('getAnalysesPaginated', () => {
    it('should return paginated analyses with correct structure', async () => {
      const userId = 'user-123'
      const params = {
        page: 1,
        limit: 10,
        sortBy: 'createdAt' as const,
        sortOrder: 'desc' as const
      }

      const mockAnalyses = [mockAnalysis]
      const mockTotal = 1

      vi.mocked(mockRepository.findAnalysesByUserId).mockResolvedValue(mockAnalyses)
      vi.mocked(mockRepository.countAnalysesByUserId).mockResolvedValue(mockTotal)

      const result = await service.getAnalysesPaginated(userId, params)

      expect(result.data).toHaveLength(1)
      expect(result.data[0]).toEqual({
        id: mockAnalysis.id,
        title: mockAnalysis.title,
        description: mockAnalysis.description,
        createdAt: mockAnalysis.createdAt.toISOString(),
        updatedAt: mockAnalysis.updatedAt.toISOString()
      })
      expect(result.pagination).toEqual({
        page: 1,
        limit: 10,
        total: 1,
        totalPages: 1
      })
    })

    it('should calculate correct offset for different pages', async () => {
      const userId = 'user-123'
      const params = {
        page: 3,
        limit: 10,
        sortBy: 'createdAt' as const,
        sortOrder: 'desc' as const
      }

      vi.mocked(mockRepository.findAnalysesByUserId).mockResolvedValue([])
      vi.mocked(mockRepository.countAnalysesByUserId).mockResolvedValue(0)

      await service.getAnalysesPaginated(userId, params)

      expect(mockRepository.findAnalysesByUserId).toHaveBeenCalledWith(userId, expect.objectContaining({
        offset: 20
      }))
    })

    it('should pass search parameter to repository', async () => {
      const userId = 'user-123'
      const params = {
        page: 1,
        limit: 10,
        sortBy: 'createdAt' as const,
        sortOrder: 'desc' as const,
        search: 'test search'
      }

      vi.mocked(mockRepository.findAnalysesByUserId).mockResolvedValue([])
      vi.mocked(mockRepository.countAnalysesByUserId).mockResolvedValue(0)

      await service.getAnalysesPaginated(userId, params)

      expect(mockRepository.findAnalysesByUserId).toHaveBeenCalledWith(userId, expect.objectContaining({
        search: 'test search'
      }))
      expect(mockRepository.countAnalysesByUserId).toHaveBeenCalledWith(userId, {
        search: 'test search'
      })
    })

    it('should calculate total pages correctly', async () => {
      const userId = 'user-123'
      const params = {
        page: 1,
        limit: 10,
        sortBy: 'createdAt' as const,
        sortOrder: 'desc' as const
      }

      vi.mocked(mockRepository.findAnalysesByUserId).mockResolvedValue([])
      vi.mocked(mockRepository.countAnalysesByUserId).mockResolvedValue(25)

      const result = await service.getAnalysesPaginated(userId, params)

      expect(result.pagination.totalPages).toBe(3)
    })

    it('should return minimum 1 page for empty results', async () => {
      const userId = 'user-123'
      const params = {
        page: 1,
        limit: 10,
        sortBy: 'createdAt' as const,
        sortOrder: 'desc' as const
      }

      vi.mocked(mockRepository.findAnalysesByUserId).mockResolvedValue([])
      vi.mocked(mockRepository.countAnalysesByUserId).mockResolvedValue(0)

      const result = await service.getAnalysesPaginated(userId, params)

      expect(result.pagination.totalPages).toBe(1)
    })
  })

  describe('getAnalysisById', () => {
    it('should return analysis when user is owner', async () => {
      const analysisId = mockAnalysis.id
      const userId = mockAnalysis.userId

      vi.mocked(mockRepository.getAnalysisById).mockResolvedValue(mockAnalysis)

      const result = await service.getAnalysisById(analysisId, userId)

      expect(result).toEqual(mockAnalysis)
      expect(mockRepository.getAnalysisById).toHaveBeenCalledWith(analysisId)
    })

    it('should throw AnalysisNotFoundError when analysis does not exist', async () => {
      const analysisId = 'non-existent-id'
      const userId = 'user-123'

      vi.mocked(mockRepository.getAnalysisById).mockResolvedValue(null)

      await expect(service.getAnalysisById(analysisId, userId))
        .rejects.toThrow(AnalysisNotFoundError)
    })

    it('should throw UnauthorizedAnalysisAccessError when user is not owner', async () => {
      const analysisId = mockAnalysis.id
      const unauthorizedUserId = 'different-user'

      vi.mocked(mockRepository.getAnalysisById).mockResolvedValue(mockAnalysis)

      await expect(service.getAnalysisById(analysisId, unauthorizedUserId))
        .rejects.toThrow(UnauthorizedAnalysisAccessError)
    })
  })

  describe('updateAnalysis', () => {
    it('should update analysis when user is owner', async () => {
      const analysisId = mockAnalysis.id
      const userId = mockAnalysis.userId
      const input = {
        title: 'Updated Title',
        description: 'Updated Description'
      }

      const updatedAnalysis = { ...mockAnalysis, ...input }

      vi.mocked(mockRepository.getAnalysisById).mockResolvedValue(mockAnalysis)
      vi.mocked(mockRepository.updateAnalysis).mockResolvedValue(updatedAnalysis)

      const result = await service.updateAnalysis(analysisId, userId, input)

      expect(result).toEqual(updatedAnalysis)
      expect(mockRepository.updateAnalysis).toHaveBeenCalledWith(analysisId, {
        title: input.title,
        description: input.description
      })
    })

    it('should convert undefined description to null', async () => {
      const analysisId = mockAnalysis.id
      const userId = mockAnalysis.userId
      const input = { title: 'Updated Title' }

      vi.mocked(mockRepository.getAnalysisById).mockResolvedValue(mockAnalysis)
      vi.mocked(mockRepository.updateAnalysis).mockResolvedValue(mockAnalysis)

      await service.updateAnalysis(analysisId, userId, input)

      expect(mockRepository.updateAnalysis).toHaveBeenCalledWith(analysisId, {
        title: input.title,
        description: null
      })
    })

    it('should throw when analysis not found', async () => {
      const analysisId = 'non-existent-id'
      const userId = 'user-123'
      const input = { title: 'Updated Title' }

      vi.mocked(mockRepository.getAnalysisById).mockResolvedValue(null)

      await expect(service.updateAnalysis(analysisId, userId, input))
        .rejects.toThrow(AnalysisNotFoundError)

      expect(mockRepository.updateAnalysis).not.toHaveBeenCalled()
    })

    it('should throw when user is not owner', async () => {
      const analysisId = mockAnalysis.id
      const unauthorizedUserId = 'different-user'
      const input = { title: 'Updated Title' }

      vi.mocked(mockRepository.getAnalysisById).mockResolvedValue(mockAnalysis)

      await expect(service.updateAnalysis(analysisId, unauthorizedUserId, input))
        .rejects.toThrow(UnauthorizedAnalysisAccessError)

      expect(mockRepository.updateAnalysis).not.toHaveBeenCalled()
    })
  })

  describe('deleteAnalysis', () => {
    it('should delete analysis when user is owner', async () => {
      const analysisId = mockAnalysis.id
      const userId = mockAnalysis.userId

      vi.mocked(mockRepository.getAnalysisById).mockResolvedValue(mockAnalysis)
      vi.mocked(mockRepository.deleteAnalysis).mockResolvedValue(undefined)

      await service.deleteAnalysis(analysisId, userId)

      expect(mockRepository.deleteAnalysis).toHaveBeenCalledWith(analysisId)
    })

    it('should throw when analysis not found', async () => {
      const analysisId = 'non-existent-id'
      const userId = 'user-123'

      vi.mocked(mockRepository.getAnalysisById).mockResolvedValue(null)

      await expect(service.deleteAnalysis(analysisId, userId))
        .rejects.toThrow(AnalysisNotFoundError)

      expect(mockRepository.deleteAnalysis).not.toHaveBeenCalled()
    })

    it('should throw when user is not owner', async () => {
      const analysisId = mockAnalysis.id
      const unauthorizedUserId = 'different-user'

      vi.mocked(mockRepository.getAnalysisById).mockResolvedValue(mockAnalysis)

      await expect(service.deleteAnalysis(analysisId, unauthorizedUserId))
        .rejects.toThrow(UnauthorizedAnalysisAccessError)

      expect(mockRepository.deleteAnalysis).not.toHaveBeenCalled()
    })
  })
})
