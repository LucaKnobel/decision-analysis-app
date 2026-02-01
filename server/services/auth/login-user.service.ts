import type { LoginUserBodyDTO } from '@server/api/schemas/auth/login-user.body.schema'
import type { UserRepository } from '@contracts/repositories/user-repository'
import type { PasswordHasher } from '@contracts/security/password-hasher'
import type { Logger } from '@contracts/logging/logger'
import { InvalidCredentialsError } from './login-user.errors'

const DUMMY_PASSWORD_HASH = '$2b$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewY5oCa2hSEHSzXu'

export async function loginUser(
  deps: {
    userRepository: UserRepository
    passwordHasher: PasswordHasher
    logger: Logger
  },
  input: LoginUserBodyDTO
): Promise<string> {
  deps.logger.debug('Login attempt started')
  const user = await deps.userRepository.getUserByEmail(input.email)
  const hashToVerify = user?.passwordHash ?? DUMMY_PASSWORD_HASH
  const isPasswordValid = await deps.passwordHasher.verify(input.password, hashToVerify)
  if (!user || !isPasswordValid) {
    deps.logger.warn('Login failed: invalid credentials', { userId: user?.id })
    throw new InvalidCredentialsError()
  }

  deps.logger.info('User logged in successfully', { userId: user.id })
  return user.id
}
