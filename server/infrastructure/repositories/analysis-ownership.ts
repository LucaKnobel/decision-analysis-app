import { prisma } from '../db/prisma'

export const isAnalysisOwner = async (userId: string, analysisId: string): Promise<boolean> => {
  const analysis = await prisma.analysis.findFirst({
    where: {
      id: analysisId,
      userId
    },
    select: { id: true }
  })

  return analysis !== null
}
