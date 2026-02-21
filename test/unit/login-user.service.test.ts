// TC-ID: TC-UT-01
import { describe, it, expect, beforeEach, vi } from 'vitest'
import { loginUser } from '../../server/services/auth/login-user.service'
import { InvalidCredentialsError } from '../../server/services/auth/login-user.errors'
import type { UserRepository } from '../../server/contracts/repositories/user-repository'
import type { PasswordHasher } from '../../server/contracts/security/password-hasher'
import type { Logger } from '../../server/contracts/logging/logger'

describe('loginUser', () => {
  let mockRepository: UserRepository
  let mockPasswordHasher: PasswordHasher
  let mockLogger: Logger

  const input = {
    email: 'test@example.com',
    password: 'password123'
  }

  const mockUser = {
    id: 'user-123',
    email: input.email,
    passwordHash: 'hashed-password'
  }

  beforeEach(() => {
    mockRepository = {
      getUserByEmail: vi.fn()
    } as unknown as UserRepository

    mockPasswordHasher = {
      verify: vi.fn()
    } as unknown as PasswordHasher

    mockLogger = {
      debug: vi.fn(),
      info: vi.fn(),
      warn: vi.fn(),
      error: vi.fn()
    } as Logger
  })

  it('should login user with valid credentials', async () => {
    vi.mocked(mockRepository.getUserByEmail).mockResolvedValue(mockUser)
    vi.mocked(mockPasswordHasher.verify).mockResolvedValue(true)

    const result = await loginUser(
      { userRepository: mockRepository, passwordHasher: mockPasswordHasher, logger: mockLogger },
      input
    )

    expect(result).toBe(mockUser.id)
    expect(mockRepository.getUserByEmail).toHaveBeenCalledWith(input.email)
    expect(mockPasswordHasher.verify).toHaveBeenCalledWith(input.password, mockUser.passwordHash)
    expect(mockLogger.info).toHaveBeenCalledWith('User logged in successfully', { userId: mockUser.id })
  })

  it('should throw InvalidCredentialsError when user not found', async () => {
    vi.mocked(mockRepository.getUserByEmail).mockResolvedValue(null)
    vi.mocked(mockPasswordHasher.verify).mockResolvedValue(false)

    await expect(
      loginUser(
        { userRepository: mockRepository, passwordHasher: mockPasswordHasher, logger: mockLogger },
        input
      )
    ).rejects.toThrow(InvalidCredentialsError)

    expect(mockLogger.warn).toHaveBeenCalledWith('Login failed: invalid credentials', { userId: undefined })
  })

  it('should throw InvalidCredentialsError when password is invalid', async () => {
    vi.mocked(mockRepository.getUserByEmail).mockResolvedValue(mockUser)
    vi.mocked(mockPasswordHasher.verify).mockResolvedValue(false)

    await expect(
      loginUser(
        { userRepository: mockRepository, passwordHasher: mockPasswordHasher, logger: mockLogger },
        input
      )
    ).rejects.toThrow(InvalidCredentialsError)

    expect(mockLogger.warn).toHaveBeenCalledWith('Login failed: invalid credentials', { userId: mockUser.id })
  })

  it('should log debug message at start of login', async () => {
    vi.mocked(mockRepository.getUserByEmail).mockResolvedValue(mockUser)
    vi.mocked(mockPasswordHasher.verify).mockResolvedValue(true)

    await loginUser(
      { userRepository: mockRepository, passwordHasher: mockPasswordHasher, logger: mockLogger },
      input
    )

    expect(mockLogger.debug).toHaveBeenCalledWith('Login attempt started')
  })
})
