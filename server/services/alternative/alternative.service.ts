import { AlternativeNotFoundError, UnauthorizedAlternativeAccessError } from './alternative.errors'
import type { CreateAlternativesBodyDTO } from '@server/api/schemas/alternatives/create-alternatives.body.schema'
import type { UpdateAlternativesBodyDTO } from '@server/api/schemas/alternatives/update-alternatives.body.schema'
import type { AlternativeRepository } from '@contracts/repositories/alternative-repository'
import type { Logger } from '@contracts/logging/logger'
import type { Alternative } from '@generated/prisma/client'
import type { AuthorizationService } from '@contracts/security/authorization-service'

export class AlternativeService {
  constructor(
    private readonly alternativeRepository: AlternativeRepository,
    private readonly logger: Logger,
    private readonly authorizationService: AuthorizationService
  ) {}

  async createAlternatives(
    userId: string,
    analysisId: string,
    input: CreateAlternativesBodyDTO
  ): Promise<Alternative[]> {
    this.logger.debug('Creating alternatives', {
      userId,
      analysisId,
      count: input.alternatives.length
    })

    const created = await this.alternativeRepository.createAlternatives(
      userId,
      analysisId,
      input.alternatives
    )
    this.authorizationService.assertAuthorizedResult(
      created,
      'Unauthorized alternatives operation',
      { userId, analysisId },
      new UnauthorizedAlternativeAccessError()
    )

    this.logger.info('Alternatives created successfully', {
      userId,
      analysisId,
      count: created.length
    })

    return created
  }

  async getAlternatives(
    userId: string,
    analysisId: string
  ): Promise<Alternative[]> {
    this.logger.debug('Fetching alternatives', { userId, analysisId })

    const alternatives = await this.alternativeRepository.findAlternativesByUserId(userId, analysisId)

    this.logger.debug('Alternatives fetched successfully', {
      userId,
      analysisId,
      count: alternatives.length
    })

    return alternatives
  }

  async replaceAlternatives(
    userId: string,
    analysisId: string,
    input: UpdateAlternativesBodyDTO
  ): Promise<Alternative[]> {
    this.logger.debug('Replacing alternatives', {
      userId,
      analysisId,
      count: input.alternatives.length
    })

    await this.assertKnownAlternatives(userId, analysisId, input)

    const replaced = await this.alternativeRepository.replaceAlternatives(
      userId,
      analysisId,
      input.alternatives
    )
    this.authorizationService.assertAuthorizedResult(
      replaced,
      'Unauthorized alternatives operation',
      { userId, analysisId },
      new UnauthorizedAlternativeAccessError()
    )

    this.logger.info('Alternatives replaced successfully', {
      userId,
      analysisId,
      count: replaced.length
    })

    return replaced
  }

  private async assertKnownAlternatives(
    userId: string,
    analysisId: string,
    input: UpdateAlternativesBodyDTO
  ): Promise<void> {
    const existingIds = await this.getExistingAlternativeIds(userId, analysisId)
    const unknownIds = this.getUnknownAlternativeIds(existingIds, input)

    if (unknownIds.length > 0) {
      this.logger.warn('Alternatives not found during replace', {
        userId,
        analysisId,
        alternativeIds: unknownIds
      })
      throw new AlternativeNotFoundError()
    }
  }

  private async getExistingAlternativeIds(
    userId: string,
    analysisId: string
  ): Promise<Set<string>> {
    const existing = await this.alternativeRepository.findAlternativesByUserId(userId, analysisId)
    return new Set(existing.map(alternative => alternative.id))
  }

  private getUnknownAlternativeIds(
    existingIds: Set<string>,
    input: UpdateAlternativesBodyDTO
  ): string[] {
    return input.alternatives
      .map(alternative => alternative.id)
      .filter((alternativeId): alternativeId is string => typeof alternativeId === 'string')
      .filter(alternativeId => !existingIds.has(alternativeId))
  }
}
