import type { Analysis } from '@generated/prisma/client'

export interface AnalysisRepository {
  createAnalysis(data: {
    userId: string
    title: string
    description: string | null
  }): Promise<Analysis>

  findAnalysesByUserId(
    userId: string,
    offset: number,
    limit: number,
    sortBy: 'createdAt' | 'updatedAt' | 'title',
    sortOrder: 'asc' | 'desc'
  ): Promise<Analysis[]>

  countAnalysesByUserId(userId: string): Promise<number>

  getAnalysisById(id: string): Promise<Analysis | null>

  updateAnalysis(id: string, data: {
    title?: string
    description?: string | null
  }): Promise<Analysis>

  deleteAnalysis(id: string): Promise<void>
}
