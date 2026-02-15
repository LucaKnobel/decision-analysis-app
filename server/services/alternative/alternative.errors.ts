export const AlternativeErrors = {
  AlternativeNotFound: 'ALTERNATIVE_NOT_FOUND',
  UnauthorizedAccess: 'UNAUTHORIZED_ALTERNATIVE_ACCESS'
} as const

export class AlternativeNotFoundError extends Error {
  readonly code = AlternativeErrors.AlternativeNotFound
}

export class UnauthorizedAlternativeAccessError extends Error {
  readonly code = AlternativeErrors.UnauthorizedAccess
}
