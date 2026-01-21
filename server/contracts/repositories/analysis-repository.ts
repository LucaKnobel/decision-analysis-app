import type { Analysis } from '@generated/prisma/client'

export interface AnalysisRepository {
  createAnalysis(data: {
    userId: string
    title: string
    description: string | null
  }): Promise<Analysis>

  getAnalysesByUserId(userId: string): Promise<Analysis[]>

  getAnalysisById(id: string): Promise<Analysis | null>
}
