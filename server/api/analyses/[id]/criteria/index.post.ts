import { CreateCriteriaBodySchema } from '~~/server/api/schemas/criteria/create-criteria.body.schema'
import { AnalysisIdParamsSchema } from '~~/server/api/schemas/analyses/analysis-id.params.schema'
import { CreateCriteriaResponseSchema } from '~~/server/api/schemas/criteria/create-criteria.response.schema'
import { CriterionService } from '~~/server/services/criterion/criterion.service'
import { UnauthorizedCriterionAccessError } from '~~/server/services/criterion/criterion.errors'
import { criterionRepository } from '@infrastructure/repositories/criterion-repository.prisma'
import { logger } from '@infrastructure/logging/logger.pino'

export default defineEventHandler(async (event) => {
  const { user } = await requireUserSession(event)
  const params = AnalysisIdParamsSchema.parse({
    id: getRouterParam(event, 'id')
  })
  const dto = await readValidatedBody(event, CreateCriteriaBodySchema.parse)

  try {
    const criterionService = new CriterionService(criterionRepository, logger)
    const criteria = await criterionService.createCriteria(user.id, params.id, dto)
    setResponseStatus(event, 201)
    return CreateCriteriaResponseSchema.parse({ data: criteria })
  } catch (error: unknown) {
    if (error instanceof UnauthorizedCriterionAccessError) {
      throw createError({ status: 404, statusText: 'Analysis not found' })
    }

    logger.error('Unexpected error during criterion creation', {}, error instanceof Error ? error : undefined)
    throw createError({
      status: 500,
      statusText: 'Internal server error'
    })
  }
})
