import type { CreateAnalysisRequestDTO } from '#shared/types/analysis'

export const useAnalysisApi = () => {
  const createAnalysis = async (dto: CreateAnalysisRequestDTO) => {
    return await $fetch('/api/analyses', {
      method: 'POST',
      body: dto
    })
  }
  return { createAnalysis }
}
