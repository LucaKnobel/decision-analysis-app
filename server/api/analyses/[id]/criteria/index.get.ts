import { AnalysisIdParamsSchema } from '@server/api/schemas/analyses/analysis-id.params.schema'
import { GetCriteriaResponseSchema } from '@server/api/schemas/criteria/get-criteria.response.schema'
import { AnalysisService } from '@server/services/analysis/analysis.service'
import { AnalysisNotFoundError, UnauthorizedAnalysisAccessError } from '@server/services/analysis/analysis.errors'
import { CriterionService } from '@server/services/criterion/criterion.service'
import { criterionRepository } from '@infrastructure/repositories/criterion-repository.prisma'
import { analysisRepository } from '@infrastructure/repositories/analysis-repository.prisma'
import { logger } from '@infrastructure/logging/logger.pino'

export default defineEventHandler(async (event) => {
  const { user } = await requireUserSession(event)
  const params = AnalysisIdParamsSchema.parse({
    id: getRouterParam(event, 'id')
  })

  try {
    // für was analysisService.getAnalysisById? Nur um zu prüfen, ob die Analyse existiert und ob der Nutzer Zugriff hat.?????
    const analysisService = new AnalysisService(analysisRepository, logger)
    await analysisService.getAnalysisById(params.id, user.id)

    const criterionService = new CriterionService(criterionRepository, logger)
    const criteria = await criterionService.getCriteria(user.id, params.id)

    return GetCriteriaResponseSchema.parse({ data: criteria })
  } catch (error: unknown) {
    if (error instanceof AnalysisNotFoundError || error instanceof UnauthorizedAnalysisAccessError) {
      throw createError({ status: 404, statusText: 'Analysis not found' })
    }

    logger.error('Unexpected error during criteria fetch', {}, error instanceof Error ? error : undefined)
    throw createError({
      status: 500,
      statusText: 'Internal server error'
    })
  }
})
