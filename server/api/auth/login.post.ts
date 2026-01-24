import { LoginUserRequestSchema } from '@server/api/schemas/auth/login-user.request.schema'
import { loginUser } from '@services/auth/login-user.service'
import { InvalidCredentialsError } from '@services/auth/login-user.errors'
import { userRepository } from '@infrastructure/repositories/user-repository.prisma'
import { bcryptHasher } from '@infrastructure/security/password-hasher.bcrypt'
import { logger } from '@infrastructure/logging/logger.pino'

export default defineEventHandler(async (event) => {
  const dto = await readValidatedBody(event, LoginUserRequestSchema.parse)
  try {
    const userId = await loginUser({ userRepository, passwordHasher: bcryptHasher, logger }, dto)
    await setUserSession(event, {
      user: {
        id: userId
      }
    })
    setResponseStatus(event, 204)
  } catch (error: unknown) {
    if (error instanceof InvalidCredentialsError) {
      logger.warn('Login failed: invalid credentials')
      throw createError({
        status: 401,
        statusText: 'Invalid credentials'
      })
    }
    logger.error('Unexpected error during login', {}, error instanceof Error ? error : undefined)
    throw createError({
      status: 500,
      statusText: 'Internal server error'
    })
  }
})
