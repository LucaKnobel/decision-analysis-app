export const AnalysisErrors = {
  AnalysisNotFound: 'ANALYSIS_NOT_FOUND',
  UnauthorizedAccess: 'UNAUTHORIZED_ANALYSIS_ACCESS'
} as const

export class AnalysisNotFoundError extends Error {
  readonly code = AnalysisErrors.AnalysisNotFound
}

export class UnauthorizedAnalysisAccessError extends Error {
  readonly code = AnalysisErrors.UnauthorizedAccess
}
