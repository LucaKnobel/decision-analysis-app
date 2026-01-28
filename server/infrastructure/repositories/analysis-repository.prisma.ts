import { prisma } from '../db/prisma'
import type { AnalysisRepository } from '@contracts/repositories/analysis-repository'
import type { Prisma } from '@generated/prisma/client'

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

  async findAnalysesByUserId(userId, params) {
    const where = buildWhere(userId, params.search)
    return prisma.analysis.findMany({
      where,
      skip: params.offset,
      take: params.limit,
      orderBy: { [params.sortBy]: params.sortOrder }
    })
  },

  async countAnalysesByUserId(userId, params = {}) {
    const where = buildWhere(userId, params.search)
    return prisma.analysis.count({
      where
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

function buildWhere(userId: string, search?: string): Prisma.AnalysisWhereInput {
  return {
    userId,
    ...(search && {
      OR: [
        { title: { contains: search, mode: 'insensitive' } },
        { description: { contains: search, mode: 'insensitive' } }
      ]
    })
  }
}
