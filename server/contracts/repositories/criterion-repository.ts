import type { Criterion } from '@generated/prisma/client'

export interface CriterionRepository {
  createCriterion(
    userId: string,
    analysisId: string,
    criterionTitle: string,
  ): Promise<Criterion | null>

  createCriteria(
    userId: string,
    analysisId: string,
    criterionTitles: string[],
  ): Promise<Criterion[] | null>

  findCriteriaByUserId(
    userId: string,
    analysisId: string,
  ): Promise<Criterion[]>

  updateCriterion(data: {
    userId: string
    analysisId: string
    criterionId: string
    criterionTitle: string
  }): Promise<Criterion | null>

  deleteCriterion(
    userId: string,
    analysisId: string,
    criterionId: string
  ): Promise<boolean>
}
