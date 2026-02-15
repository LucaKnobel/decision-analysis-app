export interface AuthorizationService {
  assertAuthorizedResult<T>(
    result: T | null,
    message: string,
    context: Record<string, unknown>,
    error: Error
  ): asserts result is T
}
