import { prisma } from '../db/prisma'
import { isAnalysisOwner } from './analysis-ownership'
import type { AlternativeRepository } from '@contracts/repositories/alternative-repository'

export const alternativeRepository: AlternativeRepository = {
  async createAlternatives(userId, analysisId, alternatives) {
    const isOwner = await isAnalysisOwner(userId, analysisId)
    if (!isOwner) {
      return null
    }

    const operations = alternatives.map(alternative =>
      prisma.alternative.create({
        data: {
          analysisId,
          name: alternative.name
        }
      })
    )

    return prisma.$transaction(operations)
  },

  async findAlternativesByUserId(userId, analysisId) {
    return prisma.alternative.findMany({
      where: {
        analysisId,
        analysis: { userId }
      }
    })
  },

  async replaceAlternatives(userId, analysisId, alternatives) {
    const isOwner = await isAnalysisOwner(userId, analysisId)
    if (!isOwner) {
      return null
    }

    const existingIds = await fetchAlternativeIds(analysisId)
    const incomingIds = collectIncomingIds(alternatives)
    const deleteIds = computeDeleteIds(existingIds, incomingIds)

    const operations = buildOperations(analysisId, alternatives, deleteIds)
    if (operations.length > 0) {
      await prisma.$transaction(operations)
    }

    return fetchAlternatives(analysisId)
  }
}

const fetchAlternativeIds = async (analysisId: string): Promise<Set<string>> => {
  const existing = await prisma.alternative.findMany({
    where: { analysisId },
    select: { id: true }
  })

  return new Set(existing.map(alternative => alternative.id))
}

const collectIncomingIds = (alternatives: Array<{ id?: string }>): Set<string> => {
  return new Set(
    alternatives
      .map(alternative => alternative.id)
      .filter((alternativeId): alternativeId is string => typeof alternativeId === 'string')
  )
}

const computeDeleteIds = (existingIds: Set<string>, incomingIds: Set<string>): string[] => {
  return [...existingIds].filter(id => !incomingIds.has(id))
}

const buildOperations = (
  analysisId: string,
  alternatives: Array<{ id?: string, name: string }>,
  deleteIds: string[]
) => {
  const updateOperations = alternatives
    .filter(alternative => typeof alternative.id === 'string')
    .map(alternative =>
      prisma.alternative.update({
        where: { id: alternative.id as string },
        data: {
          name: alternative.name
        }
      })
    )

  const createOperations = alternatives
    .filter(alternative => !alternative.id)
    .map(alternative =>
      prisma.alternative.create({
        data: {
          analysisId,
          name: alternative.name
        }
      })
    )

  const deleteOperation = deleteIds.length
    ? prisma.alternative.deleteMany({ where: { id: { in: deleteIds } } })
    : null

  return [
    ...updateOperations,
    ...createOperations,
    ...(deleteOperation ? [deleteOperation] : [])
  ]
}

const fetchAlternatives = async (analysisId: string) => {
  return prisma.alternative.findMany({
    where: { analysisId }
  })
}
