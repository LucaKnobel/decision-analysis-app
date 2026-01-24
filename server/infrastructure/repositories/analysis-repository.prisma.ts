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

  async findAnalysesByUserId(userId, offset, limit, sortBy, sortOrder) {
    return prisma.analysis.findMany({
      where: { userId },
      skip: offset,
      take: limit,
      orderBy: { [sortBy]: sortOrder }
    })
  },

  async countAnalysesByUserId(userId) {
    return prisma.analysis.count({
      where: { userId }
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
