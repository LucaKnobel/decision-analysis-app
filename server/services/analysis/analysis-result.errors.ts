export const AnalysisResultErrors = {
  InvalidWeightSum: 'INVALID_WEIGHT_SUM',
  MissingRatings: 'MISSING_RATINGS'
} as const

export class InvalidWeightSumError extends Error {
  readonly code = AnalysisResultErrors.InvalidWeightSum
}

export class MissingRatingsError extends Error {
  readonly code = AnalysisResultErrors.MissingRatings
}
