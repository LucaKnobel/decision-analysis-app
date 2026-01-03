import { RegisterUserRequestSchema } from '@server/api/schemas/auth/register-user.request.schema'
import { registerUser } from '@services/auth/register-user.service'
import { EmailAlreadyExistsError } from '@services/auth/register-user.errors'
import { userRepository } from '@infrastructure/repositories/user-repository.prisma'
import { createBcryptHasher } from '@infrastructure/security/password-hasher.bcrypt'

export default defineEventHandler(async (event) => {
  const dto = await readValidatedBody(event, RegisterUserRequestSchema.parse)
  try {
    await registerUser({ userRepository, passwordHasher: createBcryptHasher(12) }, dto)
    setResponseStatus(event, 201)
  } catch (error: unknown) {
    if (error instanceof EmailAlreadyExistsError) {
      setResponseStatus(event, 400)
      return
    }
    console.error('Error during user registration:', error)
    setResponseStatus(event, 500)
  }
  return
})
