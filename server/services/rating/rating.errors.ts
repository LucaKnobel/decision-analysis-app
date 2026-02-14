export const RatingErrors = {
  RatingNotFound: 'RATING_NOT_FOUND',
  UnauthorizedAccess: 'UNAUTHORIZED_RATING_ACCESS'
} as const

export class RatingNotFoundError extends Error {
  readonly code = RatingErrors.RatingNotFound
}

export class UnauthorizedRatingAccessError extends Error {
  readonly code = RatingErrors.UnauthorizedAccess
}
