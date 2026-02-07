import type { Criterion } from '@generated/prisma/client'

export interface CriterionRepository {
  createCriterion(
    userId: string,
    analysisId: string,
    criterionTitle: string,
    weight: number
  ): Promise<Criterion | null>

  createCriteria(
    userId: string,
    analysisId: string,
    criteria: Array<{ name: string, weight: number }>,
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
    weight: number
  }): Promise<Criterion | null>

  deleteCriterion(
    userId: string,
    analysisId: string,
    criterionId: string
  ): Promise<boolean>

  replaceCriteria(
    userId: string,
    analysisId: string,
    criteria: Array<{ id?: string, name: string, weight: number }>
  ): Promise<Criterion[] | null>
}
