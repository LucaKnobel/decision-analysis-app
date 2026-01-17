import type { RegisterUserRequestDTO } from '@server/api/schemas/auth/register-user.request.schema'
import type { UserRepository } from '@contracts/repositories/user-repository'
import type { PasswordHasher } from '@contracts/security/password-hasher'
import type { Logger } from '@contracts/logging/logger'
import { EmailAlreadyExistsError } from './register-user.errors'

export async function registerUser(
  deps: {
    userRepository: UserRepository
    passwordHasher: PasswordHasher
    logger: Logger
  },
  input: RegisterUserRequestDTO
): Promise<void> {
  deps.logger.debug('Registration attempt started')
  const exists = await deps.userRepository.existsByEmail(input.email)
  if (exists) {
    deps.logger.warn('Registration failed: email already exists')
    throw new EmailAlreadyExistsError()
  }
  const passwordHash = await deps.passwordHasher.hash(input.password)
  const user = await deps.userRepository.createUser({ email: input.email, passwordHash })
  deps.logger.info('User registered successfully', { userId: user.id })
}
