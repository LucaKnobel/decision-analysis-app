import { prisma } from '../db/prisma'
import { isAnalysisOwner } from './analysis-ownership'
import type { RatingRepository } from '@contracts/repositories/rating-repository'

export const ratingRepository: RatingRepository = {
  async findRatingsByUserId(userId, analysisId) {
    return prisma.rating.findMany({
      where: {
        alternative: {
          analysisId,
          analysis: { userId }
        }
      }
    })
  },

  async upsertRatings(userId, analysisId, ratings) {
    const isOwner = await isAnalysisOwner(userId, analysisId)
    if (!isOwner) {
      return null
    }

    const operations = ratings.map(rating =>
      prisma.rating.upsert({
        where: {
          alternativeId_criterionId: {
            alternativeId: rating.alternativeId,
            criterionId: rating.criterionId
          }
        },
        update: { value: rating.value },
        create: {
          alternativeId: rating.alternativeId,
          criterionId: rating.criterionId,
          value: rating.value
        }
      })
    )

    if (operations.length > 0) {
      await prisma.$transaction(operations)
    }

    return prisma.rating.findMany({
      where: {
        alternative: {
          analysisId
        }
      }
    })
  }
}
