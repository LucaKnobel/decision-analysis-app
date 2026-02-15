import { deleteUser } from '@services/auth/delete-user.service'
import { UserNotFoundError } from '@services/auth/delete-user.errors'
import { userRepository } from '@infrastructure/repositories/user-repository.prisma'
import { logger } from '@infrastructure/logging/logger.pino'

export default defineEventHandler(async (event) => {
  const { user } = await requireUserSession(event)

  try {
    await deleteUser({ userRepository, logger }, user.id)
    await clearUserSession(event)
    setResponseStatus(event, 204)
  } catch (error: unknown) {
    if (error instanceof UserNotFoundError) {
      throw createError({ status: 404, statusText: 'User not found' })
    }

    logger.error('Unhandled error during account deletion', {}, error instanceof Error ? error : undefined)
    throw createError({ status: 500, statusText: 'Internal server error' })
  }
})
