import { describe, it, expect, beforeEach, vi } from 'vitest'
import { AlternativeService } from '../../server/services/alternative/alternative.service'
import { AlternativeNotFoundError, UnauthorizedAlternativeAccessError } from '../../server/services/alternative/alternative.errors'
import type { AlternativeRepository } from '../../server/contracts/repositories/alternative-repository'
import type { Logger } from '../../server/contracts/logging/logger'
import type { AuthorizationService } from '../../server/contracts/security/authorization-service'
import type { Alternative } from '../../generated/prisma/client'

describe('AlternativeService', () => {
  let service: AlternativeService
  let mockRepository: AlternativeRepository
  let mockLogger: Logger
  let mockAuthorizationService: AuthorizationService

  const mockAlternative: Alternative = {
    id: 'alt-1',
    analysisId: 'analysis-123',
    name: 'Alternative A',
    createdAt: new Date(),
    updatedAt: new Date()
  } as Alternative

  beforeEach(() => {
    mockRepository = {
      createAlternatives: vi.fn(),
      findAlternativesByUserId: vi.fn(),
      replaceAlternatives: vi.fn()
    } as AlternativeRepository

    mockLogger = {
      debug: vi.fn(),
      info: vi.fn(),
      warn: vi.fn(),
      error: vi.fn()
    } as Logger

    mockAuthorizationService = {
      assertAuthorizedResult: vi.fn()
    } as AuthorizationService

    service = new AlternativeService(mockRepository, mockLogger, mockAuthorizationService)
  })

  describe('createAlternatives', () => {
    it('should create alternatives with authorization check', async () => {
      const userId = 'user-123'
      const analysisId = 'analysis-123'
      const input = { alternatives: [{ name: 'Alternative A' }] }

      vi.mocked(mockRepository.createAlternatives).mockResolvedValue([mockAlternative])

      const result = await service.createAlternatives(userId, analysisId, input)

      expect(result).toEqual([mockAlternative])
      expect(mockRepository.createAlternatives).toHaveBeenCalledWith(userId, analysisId, input.alternatives)
      expect(mockAuthorizationService.assertAuthorizedResult).toHaveBeenCalled()
      expect(mockLogger.info).toHaveBeenCalledWith('Alternatives created successfully', {
        userId,
        analysisId,
        count: 1
      })
    })

    it('should throw UnauthorizedAlternativeAccessError when authorization fails', async () => {
      const userId = 'user-123'
      const analysisId = 'analysis-123'
      const input = { alternatives: [{ name: 'Alternative A' }] }

      vi.mocked(mockRepository.createAlternatives).mockResolvedValue([mockAlternative])
      vi.mocked(mockAuthorizationService.assertAuthorizedResult).mockImplementation(() => {
        throw new UnauthorizedAlternativeAccessError()
      })

      await expect(service.createAlternatives(userId, analysisId, input)).rejects.toThrow(
        UnauthorizedAlternativeAccessError
      )
    })
  })

  describe('getAlternatives', () => {
    it('should fetch alternatives successfully', async () => {
      const userId = 'user-123'
      const analysisId = 'analysis-123'

      vi.mocked(mockRepository.findAlternativesByUserId).mockResolvedValue([mockAlternative])

      const result = await service.getAlternatives(userId, analysisId)

      expect(result).toEqual([mockAlternative])
      expect(mockRepository.findAlternativesByUserId).toHaveBeenCalledWith(userId, analysisId)
    })

    it('should return empty array when no alternatives exist', async () => {
      const userId = 'user-123'
      const analysisId = 'analysis-123'

      vi.mocked(mockRepository.findAlternativesByUserId).mockResolvedValue([])

      const result = await service.getAlternatives(userId, analysisId)

      expect(result).toEqual([])
    })
  })

  describe('replaceAlternatives', () => {
    it('should replace alternatives with valid IDs', async () => {
      const userId = 'user-123'
      const analysisId = 'analysis-123'
      const input = { alternatives: [{ id: 'alt-1', name: 'Updated Alternative A' }] }

      vi.mocked(mockRepository.findAlternativesByUserId).mockResolvedValue([mockAlternative])
      vi.mocked(mockRepository.replaceAlternatives).mockResolvedValue([{ ...mockAlternative, name: 'Updated Alternative A' }])

      const result = await service.replaceAlternatives(userId, analysisId, input)

      expect(result[0].name).toBe('Updated Alternative A')
      expect(mockLogger.info).toHaveBeenCalledWith('Alternatives replaced successfully', {
        userId,
        analysisId,
        count: 1
      })
    })

    it('should throw AlternativeNotFoundError when replacing unknown alternatives', async () => {
      const userId = 'user-123'
      const analysisId = 'analysis-123'
      const input = { alternatives: [{ id: 'unknown-id', name: 'Alternative' }] }

      vi.mocked(mockRepository.findAlternativesByUserId).mockResolvedValue([mockAlternative])

      await expect(service.replaceAlternatives(userId, analysisId, input)).rejects.toThrow(
        AlternativeNotFoundError
      )
    })
  })
})
