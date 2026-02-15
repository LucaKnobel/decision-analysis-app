export const CriterionErrors = {
  CriterionNotFound: 'CRITERION_NOT_FOUND',
  UnauthorizedAccess: 'UNAUTHORIZED_CRITERION_ACCESS'
} as const

export class CriterionNotFoundError extends Error {
  readonly code = CriterionErrors.CriterionNotFound
}

export class UnauthorizedCriterionAccessError extends Error {
  readonly code = CriterionErrors.UnauthorizedAccess
}
