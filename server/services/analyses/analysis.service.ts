import { AnalysisNotFoundError, UnauthorizedAnalysisAccessError } from './analysis.errors'
import type { CreateAnalysisRequestDTO } from '@server/api/schemas/analysis/create-analysis.request.schema'
import type { GetAnalysesRequestDTO } from '@server/api/schemas/analysis/get-analyses.request.schema'
import type { GetAnalysesResponseDTO, AnalysisItemDTO } from '@server/api/schemas/analysis/get-analyses.response.schema'
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

  async getAnalysesPaginated(
    userId: string,
    params: GetAnalysesRequestDTO
  ): Promise<GetAnalysesResponseDTO> {
    this.logger.debug('Fetching paginated analyses', {
      userId,
      page: params.page,
      limit: params.limit,
      sortBy: params.sortBy,
      sortOrder: params.sortOrder
    })

    const offset = (params.page - 1) * params.limit

    const [analyses, total] = await Promise.all([
      this.analysisRepository.findAnalysesByUserId(
        userId,
        offset,
        params.limit,
        params.sortBy,
        params.sortOrder
      ),
      this.analysisRepository.countAnalysesByUserId(userId)
    ])

    const totalPages = Math.max(1, Math.ceil(total / params.limit))

    this.logger.debug('Analyses fetched successfully', {
      userId,
      count: analyses.length,
      total,
      totalPages
    })

    return {
      data: analyses.map(analysis => this.mapToAnalysisDTO(analysis)),
      pagination: {
        page: params.page,
        limit: params.limit,
        total,
        totalPages
      }
    }
  }

  private mapToAnalysisDTO(analysis: Analysis): AnalysisItemDTO {
    return {
      id: analysis.id,
      title: analysis.title,
      description: analysis.description,
      createdAt: analysis.createdAt.toISOString(),
      updatedAt: analysis.updatedAt.toISOString()
    }
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
