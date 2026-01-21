import { prisma } from '../db/prisma'
import type { AnalysisRepository } from '@contracts/repositories/analysis-repository'

export const analysisRepository: AnalysisRepository = {
  async createAnalysis(data) {
    return prisma.analysis.create({
      data: {
        userId: data.userId,
        title: data.title,
        description: data.description
      }
    })
  },

  async getAnalysesByUserId(userId) {
    return prisma.analysis.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' }
    })
  },

  async getAnalysisById(id) {
    return prisma.analysis.findUnique({
      where: { id }
    })
  }
}
