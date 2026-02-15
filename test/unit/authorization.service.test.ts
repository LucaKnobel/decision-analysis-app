import { describe, it, expect, beforeEach, vi } from 'vitest'
import { DefaultAuthorizationService } from '../../server/services/common/authorization.service'
import type { Logger } from '../../server/contracts/logging/logger'

describe('DefaultAuthorizationService', () => {
  let service: DefaultAuthorizationService
  let mockLogger: Logger

  beforeEach(() => {
    mockLogger = {
      debug: vi.fn(),
      info: vi.fn(),
      warn: vi.fn(),
      error: vi.fn()
    } as Logger

    service = new DefaultAuthorizationService(mockLogger)
  })

  describe('assertAuthorizedResult', () => {
    it('should not throw when result is not null', () => {
      const result = { id: 'test-id', name: 'Test Item' }
      const error = new Error('Unauthorized')
      const context = { userId: 'user-123', resourceId: 'resource-456' }

      expect(() => {
        service.assertAuthorizedResult(result, 'Test operation failed', context, error)
      }).not.toThrow()

      expect(mockLogger.warn).not.toHaveBeenCalled()
    })

    it('should throw provided error when result is null', () => {
      const error = new Error('Unauthorized Access')
      const context = { userId: 'user-123', resourceId: 'resource-456' }

      expect(() => {
        service.assertAuthorizedResult(null, 'Resource access denied', context, error)
      }).toThrow(error)
    })

    it('should throw provided error when result is undefined', () => {
      const error = new Error('Forbidden')
      const context = { userId: 'user-123', resourceId: 'resource-456' }

      expect(() => {
        service.assertAuthorizedResult(undefined, 'Operation forbidden', context, error)
      }).toThrow(error)
    })

    it('should log warning message when result is null', () => {
      const error = new Error('Unauthorized')
      const message = 'Authorization check failed'
      const context = { userId: 'user-123', resourceId: 'resource-456' }

      try {
        service.assertAuthorizedResult(null, message, context, error)
      } catch {
        // Expected to throw
      }

      expect(mockLogger.warn).toHaveBeenCalledWith(message, context)
    })

    it('should not log warning when result is valid', () => {
      const result = { id: 'test-id' }
      const error = new Error('Unauthorized')
      const context = { userId: 'user-123' }

      service.assertAuthorizedResult(result, 'Should not log', context, error)

      expect(mockLogger.warn).not.toHaveBeenCalled()
    })

    it('should work with custom error types', () => {
      class CustomAuthorizationError extends Error {
        constructor() {
          super('Custom authorization error')
          this.name = 'CustomAuthorizationError'
        }
      }

      const error = new CustomAuthorizationError()
      const context = { userId: 'user-123' }

      expect(() => {
        service.assertAuthorizedResult(null, 'Access denied', context, error)
      }).toThrow(CustomAuthorizationError)
    })
  })
})
