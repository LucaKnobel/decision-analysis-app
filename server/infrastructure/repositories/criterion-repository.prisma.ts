import { prisma } from '../db/prisma'
import type { CriterionRepository } from '@contracts/repositories/criterion-repository'

export const criterionRepository: CriterionRepository = {
  async createCriterion(userId, analysisId, criterionTitle, weight) {
    const isOwner = await isAnalysisOwner(userId, analysisId)
    if (!isOwner) {
      return null
    }
    return prisma.criterion.create({
      data: {
        analysisId,
        name: criterionTitle,
        weight
      }
    })
  },

  async createCriteria(userId, analysisId, criteria) {
    const isOwner = await isAnalysisOwner(userId, analysisId)
    if (!isOwner) {
      return null
    }

    const createOperations = criteria.map(criterion =>
      prisma.criterion.create({
        data: {
          analysisId,
          name: criterion.name,
          weight: criterion.weight
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
      data: {
        name: data.criterionTitle,
        weight: data.weight
      }
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
  },

  async replaceCriteria(userId, analysisId, criteria) {
    const isOwner = await isAnalysisOwner(userId, analysisId)
    if (!isOwner) {
      return null
    }

    const existing = await prisma.criterion.findMany({
      where: { analysisId },
      select: { id: true }
    })

    const existingIds = new Set(existing.map(criterion => criterion.id))
    const incomingIds = new Set(
      criteria
        .map(criterion => criterion.id)
        .filter((criterionId): criterionId is string => typeof criterionId === 'string')
    )

    const deleteIds = [...existingIds].filter(id => !incomingIds.has(id))

    const updateOperations = criteria
      .filter(criterion => typeof criterion.id === 'string')
      .map(criterion =>
        prisma.criterion.update({
          where: { id: criterion.id as string },
          data: {
            name: criterion.name,
            weight: criterion.weight
          }
        })
      )

    const createOperations = criteria
      .filter(criterion => !criterion.id)
      .map(criterion =>
        prisma.criterion.create({
          data: {
            analysisId,
            name: criterion.name,
            weight: criterion.weight
          }
        })
      )

    const deleteOperation = deleteIds.length
      ? prisma.criterion.deleteMany({ where: { id: { in: deleteIds } } })
      : null

    const operations = [
      ...updateOperations,
      ...createOperations,
      ...(deleteOperation ? [deleteOperation] : [])
    ]

    if (operations.length > 0) {
      await prisma.$transaction(operations)
    }

    return prisma.criterion.findMany({
      where: { analysisId }
    })
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
