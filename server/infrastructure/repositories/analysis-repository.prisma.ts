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
  },

  async updateAnalysis(id, data) {
    return prisma.analysis.update({
      where: { id },
      data: {
        title: data.title,
        description: data.description
      }
    })
  },

  async deleteAnalysis(id) {
    await prisma.analysis.delete({
      where: { id }
    })
  }
}
