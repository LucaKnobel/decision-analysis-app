import { AnalysisIdParamsSchema } from '@server/api/schemas/analyses/analysis-id.params.schema'
import { CreateAlternativesBodySchema } from '@server/api/schemas/alternatives/create-alternatives.body.schema'
import { CreateAlternativesResponseSchema } from '@server/api/schemas/alternatives/create-alternatives.response.schema'
import { AnalysisService } from '@services/analysis/analysis.service'
import { AnalysisNotFoundError, UnauthorizedAnalysisAccessError } from '@services/analysis/analysis.errors'
import { UnauthorizedAlternativeAccessError } from '@services/alternative/alternative.errors'
import { AlternativeService } from '@services/alternative/alternative.service'
import { alternativeRepository } from '@infrastructure/repositories/alternative-repository.prisma'
import { analysisRepository } from '@infrastructure/repositories/analysis-repository.prisma'
import { logger } from '@infrastructure/logging/logger.pino'
import { DefaultAuthorizationService } from '@services/common/authorization.service'

export default defineEventHandler(async (event) => {
  const { user } = await requireUserSession(event)
  const params = AnalysisIdParamsSchema.parse({
    id: getRouterParam(event, 'id')
  })
  const dto = await readValidatedBody(event, CreateAlternativesBodySchema.parse)

  try {
    const analysisService = new AnalysisService(analysisRepository, logger)
    await analysisService.getAnalysisById(params.id, user.id)

    const authorizationService = new DefaultAuthorizationService(logger)
    const alternativeService = new AlternativeService(alternativeRepository, logger, authorizationService)
    const alternatives = await alternativeService.createAlternatives(user.id, params.id, dto)

    setResponseStatus(event, 201)
    return CreateAlternativesResponseSchema.parse({ data: alternatives })
  } catch (error: unknown) {
    if (error instanceof AnalysisNotFoundError || error instanceof UnauthorizedAnalysisAccessError) {
      throw createError({ status: 404, statusText: 'Analysis not found' })
    }

    if (error instanceof UnauthorizedAlternativeAccessError) {
      throw createError({ status: 404, statusText: 'Alternatives not found' })
    }

    logger.error('Unexpected error during alternatives creation', {}, error instanceof Error ? error : undefined)
    throw createError({
      status: 500,
      statusText: 'Internal server error'
    })
  }
})
