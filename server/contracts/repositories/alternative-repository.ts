import type { Alternative } from '@generated/prisma/client'

export interface AlternativeRepository {
  createAlternatives(
    userId: string,
    analysisId: string,
    alternatives: Array<{ name: string }>
  ): Promise<Alternative[] | null>

  findAlternativesByUserId(
    userId: string,
    analysisId: string
  ): Promise<Alternative[]>

  replaceAlternatives(
    userId: string,
    analysisId: string,
    alternatives: Array<{ id?: string, name: string }>
  ): Promise<Alternative[] | null>
}
