import { useRequestFetch } from '#imports'
import type { CreateAnalysisBodyDTO, CreateAnalysisResponseDTO, GetAnalysesResponseDTO } from '#shared/types/analysis'

export interface AnalysisApi {
  createAnalysis: (dto: CreateAnalysisBodyDTO) => Promise<CreateAnalysisResponseDTO>
  fetchAnalyses: (params: { page: number, limit: number, search?: string }) => Promise<GetAnalysesResponseDTO>
  deleteAnalysis: (id: string) => Promise<void>
}

export const useAnalysisApi = (): AnalysisApi => {
  const requestFetch = useRequestFetch()

  const createAnalysis = async (dto: CreateAnalysisBodyDTO) => {
    return await $fetch<CreateAnalysisResponseDTO>('/api/analyses', { method: 'POST', body: dto })
  }

  const fetchAnalyses = async (params: { page: number, limit: number, search?: string }) => {
    return await requestFetch<GetAnalysesResponseDTO>('/api/analyses', { method: 'GET', query: params })
  }

  const deleteAnalysis = async (id: string) => {
    await $fetch(`/api/analyses/${id}`, { method: 'DELETE' })
  }

  return {
    createAnalysis,
    fetchAnalyses,
    deleteAnalysis
  }
}
