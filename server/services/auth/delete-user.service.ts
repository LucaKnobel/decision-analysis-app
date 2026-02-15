import type { UserRepository } from '@contracts/repositories/user-repository'
import type { Logger } from '@contracts/logging/logger'
import { UserNotFoundError } from './delete-user.errors'

export async function deleteUser(
  deps: {
    userRepository: UserRepository
    logger: Logger
  },
  userId: string
): Promise<void> {
  deps.logger.debug('Account deletion started', { userId })

  const deleted = await deps.userRepository.deleteUserById(userId)
  if (!deleted) {
    deps.logger.warn('Account deletion failed: user not found', { userId })
    throw new UserNotFoundError()
  }

  deps.logger.info('Account deleted successfully', { userId })
}
