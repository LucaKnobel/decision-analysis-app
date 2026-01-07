export const LoginUserErrors = {
  UserDoesntExist: 'USER_DOESNT_EXIST',
  InvalidCredentials: 'INVALID_CREDENTIALS'
} as const

export class UserDoesntExistError extends Error {
  readonly code = LoginUserErrors.UserDoesntExist
}

export class InvalidCredentialsError extends Error {
  readonly code = LoginUserErrors.InvalidCredentials
}
