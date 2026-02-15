export const DeleteUserErrors = {
  UserNotFound: 'USER_NOT_FOUND'
} as const

export class UserNotFoundError extends Error {
  readonly code = DeleteUserErrors.UserNotFound
}
