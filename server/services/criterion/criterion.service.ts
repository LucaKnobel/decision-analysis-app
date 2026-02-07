import { CriterionNotFoundError, UnauthorizedCriterionAccessError } from './criterion.errors'
import type { CreateCriteriaBodyDTO } from '~~/server/api/schemas/criteria/create-criteria.body.schema'
import type { UpdateCriteriaBodyDTO } from '~~/server/api/schemas/criteria/update-criteria.body.schema'
import type { CriterionRepository } from '@contracts/repositories/criterion-repository'
import type { Logger } from '@contracts/logging/logger'
import type { Criterion } from '@generated/prisma/client'

export class CriterionService {
  constructor(
    private readonly criterionRepository: CriterionRepository,
    private readonly logger: Logger
  ) {}

  async createCriteria(
    userId: string,
    analysisId: string,
    input: CreateCriteriaBodyDTO
  ): Promise<Criterion[]> {
    this.logger.debug('Creating criteria', {
      userId,
      analysisId,
      count: input.criteria.length
    })

    const createdCriteria = await this.createCriteriaBatch(userId, analysisId, input)
    this.assertAuthorizedCreate(userId, analysisId, createdCriteria)

    this.logger.info('Criteria created successfully', {
      userId,
      analysisId,
      count: createdCriteria.length
    })

    return createdCriteria
  }

  async getCriteria(
    userId: string,
    analysisId: string
  ): Promise<Criterion[]> {
    this.logger.debug('Fetching criteria', { userId, analysisId })

    const criteria = await this.criterionRepository.findCriteriaByUserId(userId, analysisId)

    this.logger.debug('Criteria fetched successfully', {
      userId,
      analysisId,
      count: criteria.length
    })

    return criteria
  }

  async updateCriterion(
    userId: string,
    analysisId: string,
    criterionId: string,
    criterionTitle: string,
    weight: number
  ): Promise<Criterion> {
    this.logger.debug('Updating criterion', { userId, analysisId, criterionId })

    const updatedCriterion = await this.criterionRepository.updateCriterion({
      userId,
      analysisId,
      criterionId,
      criterionTitle,
      weight
    })

    this.assertFound(userId, analysisId, criterionId, updatedCriterion)
    this.logger.info('Criterion updated successfully', { userId, analysisId, criterionId })

    return updatedCriterion
  }

  async deleteCriterion(
    userId: string,
    analysisId: string,
    criterionId: string
  ): Promise<void> {
    this.logger.debug('Deleting criterion', { userId, analysisId, criterionId })

    const deleted = await this.criterionRepository.deleteCriterion(userId, analysisId, criterionId)

    if (!deleted) {
      this.handleNotFound(userId, analysisId, criterionId)
    }

    this.logger.info('Criterion deleted successfully', { userId, analysisId, criterionId })
  }

  async replaceCriteria(
    userId: string,
    analysisId: string,
    input: UpdateCriteriaBodyDTO
  ): Promise<Criterion[]> {
    this.logger.debug('Replacing criteria', {
      userId,
      analysisId,
      count: input.criteria.length
    })

    const existing = await this.criterionRepository.findCriteriaByUserId(userId, analysisId)
    const existingIds = new Set(existing.map((criterion) => criterion.id))

    const unknownIds = input.criteria
      .map((criterion) => criterion.id)
      .filter((criterionId): criterionId is string => typeof criterionId === 'string')
      .filter((criterionId) => !existingIds.has(criterionId))

    if (unknownIds.length > 0) {
      this.logger.warn('Criteria not found during replace', {
        userId,
        analysisId,
        criterionIds: unknownIds
      })
      throw new CriterionNotFoundError()
    }

    const replaced = await this.criterionRepository.replaceCriteria(userId, analysisId, input.criteria)
    this.assertAuthorizedCreate(userId, analysisId, replaced)

    this.logger.info('Criteria replaced successfully', {
      userId,
      analysisId,
      count: replaced.length
    })

    return replaced
  }

  private async createCriteriaBatch(
    userId: string,
    analysisId: string,
    input: CreateCriteriaBodyDTO
  ): Promise<Criterion[] | null> {
    return this.criterionRepository.createCriteria(
      userId,
      analysisId,
      input.criteria.map(criterion => ({
        name: criterion.name,
        weight: criterion.weight
      }))
    )
  }

  private assertAuthorizedCreate(
    userId: string,
    analysisId: string,
    createdCriteria: Criterion[] | null
  ): asserts createdCriteria is Criterion[] {
    if (!createdCriteria) {
      this.logger.warn('Unauthorized criteria creation attempt', { userId, analysisId })
      throw new UnauthorizedCriterionAccessError()
    }
  }

  private assertFound(
    userId: string,
    analysisId: string,
    criterionId: string,
    criterion: Criterion | null
  ): asserts criterion is Criterion {
    if (!criterion) {
      this.handleNotFound(userId, analysisId, criterionId)
    }
  }

  private handleNotFound(
    userId: string,
    analysisId: string,
    criterionId: string
  ): never {
    this.logger.warn('Criterion not found or unauthorized', {
      userId,
      analysisId,
      criterionId
    })
    throw new CriterionNotFoundError()
  }
}
