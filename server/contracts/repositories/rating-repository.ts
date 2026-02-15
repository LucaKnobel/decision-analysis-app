import type { Rating } from '@generated/prisma/client'

export interface RatingRepository {
  findRatingsByUserId(
    userId: string,
    analysisId: string
  ): Promise<Rating[]>

  upsertRatings(
    userId: string,
    analysisId: string,
    ratings: Array<{ alternativeId: string, criterionId: string, value: number }>
  ): Promise<Rating[] | null>
}
