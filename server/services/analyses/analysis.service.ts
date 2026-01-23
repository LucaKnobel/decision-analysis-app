import { AnalysisNotFoundError, UnauthorizedAnalysisAccessError } from './analysis.errors'
import type { CreateAnalysisRequestDTO } from '@server/api/schemas/analysis/create-analysis.request.schema'
import type { AnalysisRepository } from '@contracts/repositories/analysis-repository'
import type { Logger } from '@contracts/logging/logger'
import type { Analysis } from '@generated/prisma/client'

export class AnalysisService {
  constructor(
    private readonly analysisRepository: AnalysisRepository,
    private readonly logger: Logger
  ) {}

  async createAnalysis(
    userId: string,
    input: CreateAnalysisRequestDTO
  ): Promise<Analysis> {
    this.logger.debug('Creating analysis', { userId, title: input.title })

    const analysis = await this.analysisRepository.createAnalysis({
      userId,
      title: input.title,
      description: input.description ?? null
    })

    this.logger.info('Analysis created successfully', {
      analysisId: analysis.id,
      userId
    })

    return analysis
  }

  async getAnalysesByUserId(userId: string): Promise<Analysis[]> {
    this.logger.debug('Fetching analyses for user', { userId })

    const analyses = await this.analysisRepository.getAnalysesByUserId(userId)

    this.logger.debug('Analyses fetched successfully', {
      userId,
      count: analyses.length
    })

    return analyses
  }

  async getAnalysisById(
    analysisId: string,
    requestingUserId: string
  ): Promise<Analysis> {
    this.logger.debug('Fetching analysis', { analysisId, requestingUserId })

    const analysis = await this.analysisRepository.getAnalysisById(analysisId)

    if (!analysis) {
      this.logger.warn('Analysis not found', { analysisId })
      throw new AnalysisNotFoundError(analysisId)
    }

    if (analysis.userId !== requestingUserId) {
      this.logger.warn('Unauthorized access attempt to analysis', {
        analysisId,
        ownerId: analysis.userId,
        requestingUserId
      })
      throw new UnauthorizedAnalysisAccessError()
    }

    this.logger.debug('Analysis fetched successfully', { analysisId })

    return analysis
  }

  async updateAnalysis(
    analysisId: string,
    requestingUserId: string,
    input: Partial<CreateAnalysisRequestDTO>
  ): Promise<Analysis> {
    this.logger.debug('Updating analysis', { analysisId, requestingUserId })

    await this.getAnalysisById(analysisId, requestingUserId)

    const updatedAnalysis = await this.analysisRepository.updateAnalysis(
      analysisId,
      {
        title: input.title,
        description: input.description ?? null
      }
    )

    this.logger.info('Analysis updated successfully', {
      analysisId,
      userId: requestingUserId
    })

    return updatedAnalysis
  }

  async deleteAnalysis(
    analysisId: string,
    requestingUserId: string
  ): Promise<void> {
    this.logger.debug('Deleting analysis', { analysisId, requestingUserId })

    await this.getAnalysisById(analysisId, requestingUserId)

    await this.analysisRepository.deleteAnalysis(analysisId)

    this.logger.info('Analysis deleted successfully', {
      analysisId,
      userId: requestingUserId
    })
  }
}
