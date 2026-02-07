import { prisma } from '../db/prisma'
import type { CriterionRepository } from '@contracts/repositories/criterion-repository'

export const criterionRepository: CriterionRepository = {
  async createCriterion(userId, analysisId, criterionTitle) {
    const isOwner = await isAnalysisOwner(userId, analysisId)
    if (!isOwner) {
      return null
    }
    return prisma.criterion.create({
      data: {
        analysisId,
        name: criterionTitle,
        weight: 1
      }
    })
  },

  async createCriteria(userId, analysisId, criterionTitles) {
    const isOwner = await isAnalysisOwner(userId, analysisId)
    if (!isOwner) {
      return null
    }

    const createOperations = criterionTitles.map(title =>
      prisma.criterion.create({
        data: {
          analysisId,
          name: title,
          weight: 1
        }
      })
    )

    return prisma.$transaction(createOperations)
  },

  async findCriteriaByUserId(userId, analysisId) {
    return prisma.criterion.findMany({
      where: {
        analysisId,
        analysis: { userId }
      }
    })
  },

  async updateCriterion(data) {
    const criterion = await prisma.criterion.findFirst({
      where: {
        id: data.criterionId,
        analysisId: data.analysisId,
        analysis: { userId: data.userId }
      },
      select: { id: true }
    })

    if (!criterion) {
      return null
    }

    return prisma.criterion.update({
      where: { id: criterion.id },
      data: { name: data.criterionTitle }
    })
  },

  async deleteCriterion(userId, analysisId, criterionId) {
    const criterion = await prisma.criterion.findFirst({
      where: {
        id: criterionId,
        analysisId,
        analysis: { userId }
      },
      select: { id: true }
    })

    if (!criterion) {
      return false
    }

    await prisma.criterion.delete({
      where: { id: criterion.id }
    })

    return true
  }
}

async function isAnalysisOwner(userId: string, analysisId: string): Promise<boolean> {
  const analysis = await prisma.analysis.findFirst({
    where: {
      id: analysisId,
      userId
    },
    select: { id: true }
  })

  return analysis !== null
}
