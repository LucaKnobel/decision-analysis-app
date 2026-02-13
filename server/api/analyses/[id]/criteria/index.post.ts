import { CreateCriteriaBodySchema } from '@server/api/schemas/criteria/create-criteria.body.schema'
import { AnalysisIdParamsSchema } from '@server/api/schemas/analyses/analysis-id.params.schema'
import { CreateCriteriaResponseSchema } from '@server/api/schemas/criteria/create-criteria.response.schema'
import { CriterionService } from '@services/criterion/criterion.service'
import { UnauthorizedCriterionAccessError } from '@services/criterion/criterion.errors'
import { criterionRepository } from '@infrastructure/repositories/criterion-repository.prisma'
import { logger } from '@infrastructure/logging/logger.pino'
import { AnalysisService } from '@services/analysis/analysis.service'
import { analysisRepository } from '@infrastructure/repositories/analysis-repository.prisma'
import { AnalysisNotFoundError, UnauthorizedAnalysisAccessError } from '@services/analysis/analysis.errors'

export default defineEventHandler(async (event) => {
  const { user } = await requireUserSession(event)
  const params = AnalysisIdParamsSchema.parse({
    id: getRouterParam(event, 'id')
  })
  const dto = await readValidatedBody(event, CreateCriteriaBodySchema.parse)

  try {
    const analysisService = new AnalysisService(analysisRepository, logger)
    await analysisService.getAnalysisById(params.id, user.id)

    const criterionService = new CriterionService(criterionRepository, logger)
    const criteria = await criterionService.createCriteria(user.id, params.id, dto)
    setResponseStatus(event, 201)
    return CreateCriteriaResponseSchema.parse({ data: criteria })
  } catch (error: unknown) {
    if (error instanceof AnalysisNotFoundError || error instanceof UnauthorizedAnalysisAccessError) {
      throw createError({ status: 404, statusText: 'Analysis not found' })
    }

    if (error instanceof UnauthorizedCriterionAccessError) {
      throw createError({ status: 404, statusText: 'Criteria not found' })
    }

    logger.error('Unexpected error during criterion creation', {}, error instanceof Error ? error : undefined)
    throw createError({
      status: 500,
      statusText: 'Internal server error'
    })
  }
})
