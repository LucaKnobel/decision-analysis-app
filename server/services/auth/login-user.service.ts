import type { LoginUserRequestDTO } from '@server/api/schemas/auth/login-user.request.schema'
import type { UserRepository } from '@contracts/repositories/user-repository'
import type { PasswordHasher } from '@contracts/security/password-hasher'
import { InvalidCredentialsError } from './login-user.errors'

const DUMMY_PASSWORD_HASH = '$2b$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewY5oCa2hSEHSzXu'

export async function loginUser(
  deps: {
    userRepository: UserRepository
    passwordHasher: PasswordHasher
  },
  input: LoginUserRequestDTO
): Promise<string> {
  const user = await deps.userRepository.getUserByEmail(input.email)
  const hashToVerify = user?.passwordHash ?? DUMMY_PASSWORD_HASH
  const isPasswordValid = await deps.passwordHasher.verify(input.password, hashToVerify)
  if (!user || !isPasswordValid) {
    throw new InvalidCredentialsError()
  }
  return user.id
}
