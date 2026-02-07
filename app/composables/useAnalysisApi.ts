import { useRequestFetch } from '#imports'
import type { CreateAnalysisBodyDTO, CreateAnalysisResponseDTO, GetAnalysesResponseDTO } from '#shared/types/analysis'
import type {
  CreateCriteriaBodyDTO,
  CreateCriteriaResponseDTO,
  GetCriteriaResponseDTO,
  UpdateCriteriaBodyDTO,
  UpdateCriteriaResponseDTO
} from '#shared/types/criterion'

export interface AnalysisApi {
  createAnalysis: (dto: CreateAnalysisBodyDTO) => Promise<CreateAnalysisResponseDTO>
  fetchAnalyses: (params: { page: number, limit: number, search?: string }) => Promise<GetAnalysesResponseDTO>
  deleteAnalysis: (id: string) => Promise<void>
  createCriteria: (analysisId: string, dto: CreateCriteriaBodyDTO) => Promise<CreateCriteriaResponseDTO>
  getCriteria: (analysisId: string) => Promise<GetCriteriaResponseDTO>
  updateCriteria: (analysisId: string, dto: UpdateCriteriaBodyDTO) => Promise<UpdateCriteriaResponseDTO>
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

  const createCriteria = async (analysisId: string, dto: CreateCriteriaBodyDTO) => {
    return await $fetch<CreateCriteriaResponseDTO>(`/api/analyses/${analysisId}/criteria`, { method: 'POST', body: dto })
  }

  const getCriteria = async (analysisId: string) => {
    return await $fetch<GetCriteriaResponseDTO>(`/api/analyses/${analysisId}/criteria`, { method: 'GET' })
  }

  const updateCriteria = async (analysisId: string, dto: UpdateCriteriaBodyDTO) => {
    return await $fetch<UpdateCriteriaResponseDTO>(`/api/analyses/${analysisId}/criteria`, { method: 'PUT', body: dto })
  }

  return {
    createAnalysis,
    fetchAnalyses,
    deleteAnalysis,
    createCriteria,
    getCriteria,
    updateCriteria
  }
}
