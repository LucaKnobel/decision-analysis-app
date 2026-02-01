export const LoginUserErrors = {
  InvalidCredentials: 'INVALID_CREDENTIALS'
} as const

export class InvalidCredentialsError extends Error {
  readonly code = LoginUserErrors.InvalidCredentials
}
