import { describe, it, expect, vi, beforeEach } from 'vitest'
import { AnalysisService } from '../../server/services/analyses/analysis.service'
import { AnalysisNotFoundError, UnauthorizedAnalysisAccessError } from '../../server/services/analyses/analysis.errors'
import type { AnalysisRepository } from '../../server/contracts/repositories/analysis-repository'
import type { Logger } from '../../server/contracts/logging/logger'
import type { Analysis } from '../../generated/prisma/client'

describe('AnalysisService', () => {
  let analysisService: AnalysisService
  let mockRepository: AnalysisRepository
  let mockLogger: Logger

  const mockAnalysis: Analysis = {
    id: 'analysis-123',
    userId: 'user-123',
    title: 'Test Analysis',
    description: 'Test Description',
    createdAt: new Date('2026-01-23T10:00:00Z'),
    updatedAt: new Date('2026-01-23T10:00:00Z')
  }

  beforeEach(() => {
    mockRepository = {
      createAnalysis: vi.fn(),
      getAnalysesByUserId: vi.fn(),
      getAnalysisById: vi.fn(),
      updateAnalysis: vi.fn(),
      deleteAnalysis: vi.fn()
    }

    mockLogger = {
      debug: () => {},
      info: () => {},
      warn: () => {},
      error: () => {}
    }

    analysisService = new AnalysisService(mockRepository, mockLogger)
  })

  describe('createAnalysis', () => {
    it('should create an analysis successfully', async () => {
      vi.mocked(mockRepository.createAnalysis).mockResolvedValue(mockAnalysis)

      const result = await analysisService.createAnalysis('user-123', {
        title: 'Test Analysis',
        description: 'Test Description'
      })

      expect(result).toEqual(mockAnalysis)
      expect(mockRepository.createAnalysis).toHaveBeenCalledWith({
        userId: 'user-123',
        title: 'Test Analysis',
        description: 'Test Description'
      })
    })

    it('should create an analysis without description', async () => {
      const analysisWithoutDesc = { ...mockAnalysis, description: null }
      vi.mocked(mockRepository.createAnalysis).mockResolvedValue(analysisWithoutDesc)

      const result = await analysisService.createAnalysis('user-123', {
        title: 'Test Analysis'
      })

      expect(result).toEqual(analysisWithoutDesc)
      expect(mockRepository.createAnalysis).toHaveBeenCalledWith({
        userId: 'user-123',
        title: 'Test Analysis',
        description: null
      })
    })

    it('should handle repository errors', async () => {
      const error = new Error('Database error')
      vi.mocked(mockRepository.createAnalysis).mockRejectedValue(error)

      await expect(
        analysisService.createAnalysis('user-123', {
          title: 'Test Analysis'
        })
      ).rejects.toThrow('Database error')
    })
  })

  describe('getAnalysesByUserId', () => {
    it('should return all analyses for a user', async () => {
      const analyses = [mockAnalysis, { ...mockAnalysis, id: 'analysis-456' }]
      vi.mocked(mockRepository.getAnalysesByUserId).mockResolvedValue(analyses)

      const result = await analysisService.getAnalysesByUserId('user-123')

      expect(result).toEqual(analyses)
      expect(mockRepository.getAnalysesByUserId).toHaveBeenCalledWith('user-123')
    })

    it('should return empty array when user has no analyses', async () => {
      vi.mocked(mockRepository.getAnalysesByUserId).mockResolvedValue([])

      const result = await analysisService.getAnalysesByUserId('user-123')

      expect(result).toEqual([])
    })
  })

  describe('getAnalysisById', () => {
    it('should return analysis when user is authorized', async () => {
      vi.mocked(mockRepository.getAnalysisById).mockResolvedValue(mockAnalysis)

      const result = await analysisService.getAnalysisById('analysis-123', 'user-123')

      expect(result).toEqual(mockAnalysis)
      expect(mockRepository.getAnalysisById).toHaveBeenCalledWith('analysis-123')
    })

    it('should throw AnalysisNotFoundError when analysis does not exist', async () => {
      vi.mocked(mockRepository.getAnalysisById).mockResolvedValue(null)

      await expect(
        analysisService.getAnalysisById('analysis-999', 'user-123')
      ).rejects.toThrow(AnalysisNotFoundError)
    })

    it('should throw UnauthorizedAnalysisAccessError when user is not owner', async () => {
      vi.mocked(mockRepository.getAnalysisById).mockResolvedValue(mockAnalysis)

      await expect(
        analysisService.getAnalysisById('analysis-123', 'different-user')
      ).rejects.toThrow(UnauthorizedAnalysisAccessError)
    })
  })

  describe('updateAnalysis', () => {
    it('should update analysis when user is authorized', async () => {
      const updatedAnalysis = { ...mockAnalysis, title: 'Updated Title' }
      vi.mocked(mockRepository.getAnalysisById).mockResolvedValue(mockAnalysis)
      vi.mocked(mockRepository.updateAnalysis).mockResolvedValue(updatedAnalysis)

      const result = await analysisService.updateAnalysis(
        'analysis-123',
        'user-123',
        { title: 'Updated Title' }
      )

      expect(result).toEqual(updatedAnalysis)
      expect(mockRepository.updateAnalysis).toHaveBeenCalledWith('analysis-123', {
        title: 'Updated Title',
        description: null
      })
    })

    it('should throw error when analysis does not exist', async () => {
      vi.mocked(mockRepository.getAnalysisById).mockResolvedValue(null)

      await expect(
        analysisService.updateAnalysis('analysis-999', 'user-123', {
          title: 'Updated'
        })
      ).rejects.toThrow(AnalysisNotFoundError)

      expect(mockRepository.updateAnalysis).not.toHaveBeenCalled()
    })

    it('should throw error when user is not authorized', async () => {
      vi.mocked(mockRepository.getAnalysisById).mockResolvedValue(mockAnalysis)

      await expect(
        analysisService.updateAnalysis('analysis-123', 'different-user', {
          title: 'Updated'
        })
      ).rejects.toThrow(UnauthorizedAnalysisAccessError)

      expect(mockRepository.updateAnalysis).not.toHaveBeenCalled()
    })
  })

  describe('deleteAnalysis', () => {
    it('should delete analysis when user is authorized', async () => {
      vi.mocked(mockRepository.getAnalysisById).mockResolvedValue(mockAnalysis)
      vi.mocked(mockRepository.deleteAnalysis).mockResolvedValue(undefined)

      await analysisService.deleteAnalysis('analysis-123', 'user-123')

      expect(mockRepository.deleteAnalysis).toHaveBeenCalledWith('analysis-123')
    })

    it('should throw error when analysis does not exist', async () => {
      vi.mocked(mockRepository.getAnalysisById).mockResolvedValue(null)

      await expect(
        analysisService.deleteAnalysis('analysis-999', 'user-123')
      ).rejects.toThrow(AnalysisNotFoundError)

      expect(mockRepository.deleteAnalysis).not.toHaveBeenCalled()
    })

    it('should throw error when user is not authorized', async () => {
      vi.mocked(mockRepository.getAnalysisById).mockResolvedValue(mockAnalysis)

      await expect(
        analysisService.deleteAnalysis('analysis-123', 'different-user')
      ).rejects.toThrow(UnauthorizedAnalysisAccessError)

      expect(mockRepository.deleteAnalysis).not.toHaveBeenCalled()
    })
  })
})
