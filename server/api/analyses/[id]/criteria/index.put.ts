import { AnalysisIdParamsSchema } from '@server/api/schemas/analyses/analysis-id.params.schema'
import { UpdateCriteriaBodySchema } from '@server/api/schemas/criteria/update-criteria.body.schema'
import { UpdateCriteriaResponseSchema } from '@server/api/schemas/criteria/update-criteria.response.schema'
import { AnalysisService } from '@services/analysis/analysis.service'
import { AnalysisNotFoundError, UnauthorizedAnalysisAccessError } from '@services/analysis/analysis.errors'
import { CriterionNotFoundError, UnauthorizedCriterionAccessError } from '@services/criterion/criterion.errors'
import { CriterionService } from '@services/criterion/criterion.service'
import { criterionRepository } from '@infrastructure/repositories/criterion-repository.prisma'
import { analysisRepository } from '@infrastructure/repositories/analysis-repository.prisma'
import { logger } from '@infrastructure/logging/logger.pino'

export default defineEventHandler(async (event) => {
  const { user } = await requireUserSession(event)
  const params = AnalysisIdParamsSchema.parse({
    id: getRouterParam(event, 'id')
  })
  const dto = await readValidatedBody(event, UpdateCriteriaBodySchema.parse)

  try {
    const analysisService = new AnalysisService(analysisRepository, logger)
    await analysisService.getAnalysisById(params.id, user.id)

    const criterionService = new CriterionService(criterionRepository, logger)
    const criteria = await criterionService.replaceCriteria(user.id, params.id, dto)

    return UpdateCriteriaResponseSchema.parse({ data: criteria })
  } catch (error: unknown) {
    if (error instanceof AnalysisNotFoundError || error instanceof UnauthorizedAnalysisAccessError) {
      throw createError({ status: 404, statusText: 'Analysis not found' })
    }

    if (error instanceof CriterionNotFoundError || error instanceof UnauthorizedCriterionAccessError) {
      throw createError({ status: 404, statusText: 'Criteria not found' })
    }

    logger.error('Unexpected error during criteria update', {}, error instanceof Error ? error : undefined)
    throw createError({
      status: 500,
      statusText: 'Internal server error'
    })
  }
})
