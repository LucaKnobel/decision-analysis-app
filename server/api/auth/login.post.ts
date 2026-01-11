import { LoginUserRequestSchema } from '@server/api/schemas/auth/login-user.request.schema'
import { loginUser } from '@services/auth/login-user.service'
import { InvalidCredentialsError } from '@services/auth/login-user.errors'
import { userRepository } from '@infrastructure/repositories/user-repository.prisma'
import { bcryptHasher } from '@infrastructure/security/password-hasher.bcrypt'

export default defineEventHandler(async (event) => {
  const dto = await readValidatedBody(event, LoginUserRequestSchema.parse)
  try {
    const userId = await loginUser({ userRepository, passwordHasher: bcryptHasher }, dto)
    await setUserSession(event, { userId })
    setResponseStatus(event, 204)
    return
  } catch (error: unknown) {
    if (error instanceof InvalidCredentialsError) {
      throw createError({
        statusCode: 401,
        message: 'Invalid credentials'
      })
    }
    throw createError({
      statusCode: 500,
      message: 'Internal server error'
    })
  }
})
