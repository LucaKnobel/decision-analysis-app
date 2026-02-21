// TC-ID: TC-UT-01
import { describe, it, expect, beforeEach, vi } from 'vitest'
import { deleteUser } from '../../server/services/auth/delete-user.service'
import { UserNotFoundError } from '../../server/services/auth/delete-user.errors'
import type { UserRepository } from '../../server/contracts/repositories/user-repository'
import type { Logger } from '../../server/contracts/logging/logger'

describe('deleteUser', () => {
  let mockRepository: UserRepository
  let mockLogger: Logger

  beforeEach(() => {
    mockRepository = {
      deleteUserById: vi.fn()
    } as unknown as UserRepository

    mockLogger = {
      debug: vi.fn(),
      info: vi.fn(),
      warn: vi.fn(),
      error: vi.fn()
    } as Logger
  })

  it('should delete user successfully', async () => {
    const userId = 'user-123'
    vi.mocked(mockRepository.deleteUserById).mockResolvedValue(true)

    await deleteUser({ userRepository: mockRepository, logger: mockLogger }, userId)

    expect(mockRepository.deleteUserById).toHaveBeenCalledWith(userId)
    expect(mockLogger.info).toHaveBeenCalledWith('Account deleted successfully', { userId })
  })

  it('should throw UserNotFoundError when user does not exist', async () => {
    const userId = 'non-existent-user'
    vi.mocked(mockRepository.deleteUserById).mockResolvedValue(false)

    await expect(
      deleteUser({ userRepository: mockRepository, logger: mockLogger }, userId)
    ).rejects.toThrow(UserNotFoundError)

    expect(mockLogger.warn).toHaveBeenCalledWith('Account deletion failed: user not found', { userId })
  })

  it('should log debug message at start of deletion', async () => {
    const userId = 'user-456'
    vi.mocked(mockRepository.deleteUserById).mockResolvedValue(true)

    await deleteUser({ userRepository: mockRepository, logger: mockLogger }, userId)

    expect(mockLogger.debug).toHaveBeenCalledWith('Account deletion started', { userId })
  })
})
