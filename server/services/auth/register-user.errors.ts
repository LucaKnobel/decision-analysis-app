export const RegisterUserErrors = {
  EmailAlreadyExists: 'EMAIL_ALREADY_EXISTS'
} as const

export class EmailAlreadyExistsError extends Error {
  readonly code = RegisterUserErrors.EmailAlreadyExists
}
