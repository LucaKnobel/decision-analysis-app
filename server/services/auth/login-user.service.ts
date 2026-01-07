import type { LoginUserRequestDTO } from '@server/api/schemas/auth/login-user.request.schema'
import type { UserRepository } from '@contracts/repositories/user-repository'
import type { PasswordHasher } from '@contracts/security/password-hasher'
import { UserDoesntExistError } from './login-user.errors'

export async function loginUser(
  deps: {
    userRepository: UserRepository
    passwordHasher: PasswordHasher
  },
  input: LoginUserRequestDTO
): Promise<void> {
  const exists = await deps.userRepository.existsByEmail(input.email)
  if (!exists) {
    throw new UserDoesntExistError()
  }
  // if user exists, check password hash
  // if valid, proceed with login
  // return user
  // initialize session handling etc.
}
