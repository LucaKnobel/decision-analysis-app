import type { RegisterUserRequestDTO } from '@server/api/schemas/auth/register-user.request.schema'
import type { UserRepository } from '@contracts/repositories/user-repository'
import type { PasswordHasher } from '@contracts/security/password-hasher'
import { EmailAlreadyExistsError } from './register-user.errors'

export async function registerUser(
  deps: {
    userRepository: UserRepository
    passwordHasher: PasswordHasher
  },
  input: RegisterUserRequestDTO
): Promise<void> {
  const exists = await deps.userRepository.existsByEmail(input.email)
  if (exists) {
    throw new EmailAlreadyExistsError()
  }

  const passwordHash = await deps.passwordHasher.hash(input.password)
  await deps.userRepository.createUser({ email: input.email, passwordHash })
}
