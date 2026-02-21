// TC-ID: TC-UT-01
import { describe, it, expect, beforeEach, vi } from 'vitest'
import { registerUser } from '../../server/services/auth/register-user.service'
import { EmailAlreadyExistsError } from '../../server/services/auth/register-user.errors'
import type { UserRepository } from '../../server/contracts/repositories/user-repository'
import type { PasswordHasher } from '../../server/contracts/security/password-hasher'
import type { Logger } from '../../server/contracts/logging/logger'

describe('registerUser', () => {
  let mockRepository: UserRepository
  let mockPasswordHasher: PasswordHasher
  let mockLogger: Logger

  const input = {
    email: 'test@example.com',
    password: 'password123'
  }

  beforeEach(() => {
    mockRepository = {
      existsByEmail: vi.fn(),
      createUser: vi.fn()
    } as unknown as UserRepository

    mockPasswordHasher = {
      hash: vi.fn()
    } as unknown as PasswordHasher

    mockLogger = {
      debug: vi.fn(),
      info: vi.fn(),
      warn: vi.fn(),
      error: vi.fn()
    } as Logger
  })

  it('should register new user with valid email and password', async () => {
    const userId = 'user-123'
    vi.mocked(mockRepository.existsByEmail).mockResolvedValue(false)
    vi.mocked(mockPasswordHasher.hash).mockResolvedValue('hashed-password')
    vi.mocked(mockRepository.createUser).mockResolvedValue({ id: userId })

    await registerUser(
      { userRepository: mockRepository, passwordHasher: mockPasswordHasher, logger: mockLogger },
      input
    )

    expect(mockRepository.existsByEmail).toHaveBeenCalledWith(input.email)
    expect(mockPasswordHasher.hash).toHaveBeenCalledWith(input.password)
    expect(mockRepository.createUser).toHaveBeenCalledWith({
      email: input.email,
      passwordHash: 'hashed-password'
    })
    expect(mockLogger.info).toHaveBeenCalledWith('User registered successfully', { userId })
  })

  it('should throw EmailAlreadyExistsError when email already registered', async () => {
    vi.mocked(mockRepository.existsByEmail).mockResolvedValue(true)

    await expect(
      registerUser(
        { userRepository: mockRepository, passwordHasher: mockPasswordHasher, logger: mockLogger },
        input
      )
    ).rejects.toThrow(EmailAlreadyExistsError)

    expect(mockLogger.warn).toHaveBeenCalledWith('Registration failed: email already exists')
    expect(mockPasswordHasher.hash).not.toHaveBeenCalled()
  })

  it('should log debug message at start of registration', async () => {
    vi.mocked(mockRepository.existsByEmail).mockResolvedValue(false)
    vi.mocked(mockPasswordHasher.hash).mockResolvedValue('hashed-password')
    vi.mocked(mockRepository.createUser).mockResolvedValue({ id: 'user-123' })

    await registerUser(
      { userRepository: mockRepository, passwordHasher: mockPasswordHasher, logger: mockLogger },
      input
    )

    expect(mockLogger.debug).toHaveBeenCalledWith('Registration attempt started')
  })
})
