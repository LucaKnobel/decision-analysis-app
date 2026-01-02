export type RegisterUserInput = {
  email: string
  password: string
}

export type RegisterUserResult = {
  userId: string
}

export class EmailAlreadyRegisteredError extends Error {
  constructor() { super('email_already_registered') }
}

export interface UserRepository {
  existsByEmail(email: string): Promise<boolean>
  create(data: {
    email: string
    passwordHash: string
  }): Promise<{ id: string }>
}

export interface Hasher {
  hashPassword(password: string): Promise<string>
  hashEmail(email: string): string
}

export type RegisterUserDeps = {
  userRepository: UserRepository
  hasher: Hasher
}

export const registerUserService = async (
  input: RegisterUserInput,
  deps: RegisterUserDeps
): Promise<RegisterUserResult> => {
  const { userRepository, hasher } = deps

  if (await userRepository.existsByEmail(input.email)) {
    throw new EmailAlreadyRegisteredError()
  }

  const emailHash = hasher.hashEmail(input.email)
  const passwordHash = await hasher.hashPassword(input.password)

  const { id } = await userRepository.create({
    email: emailHash,
    passwordHash
  })

  return { userId: id }
}
