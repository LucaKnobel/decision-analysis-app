import type { AuthorizationService } from '@contracts/security/authorization-service'
import type { Logger } from '@contracts/logging/logger'

export class DefaultAuthorizationService implements AuthorizationService {
  constructor(private readonly logger: Logger) {}

  assertAuthorizedResult<T>(
    result: T | null,
    message: string,
    context: Record<string, unknown>,
    error: Error
  ): asserts result is T {
    if (!result) {
      this.logger.warn(message, context)
      throw error
    }
  }
}
