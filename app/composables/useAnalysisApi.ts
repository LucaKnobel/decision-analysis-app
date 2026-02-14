import { useRequestFetch } from '#imports'
import type { CreateAnalysisBodyDTO, CreateAnalysisResponseDTO, GetAnalysesResponseDTO, GetAnalysisResponseDTO, UpdateAnalysisResponseDTO } from '#shared/types/analysis'
import type { GetAlternativesResponseDTO, UpdateAlternativesBodyDTO, UpdateAlternativesResponseDTO } from '#shared/types/alternative'
import type {
  CreateCriteriaBodyDTO,
  CreateCriteriaResponseDTO,
  GetCriteriaResponseDTO,
  UpdateCriteriaBodyDTO,
  UpdateCriteriaResponseDTO
} from '#shared/types/criterion'

export interface AnalysisApi {
  createAnalysis: (dto: CreateAnalysisBodyDTO) => Promise<CreateAnalysisResponseDTO>
  getAnalysis: (id: string) => Promise<GetAnalysisResponseDTO>
  fetchAnalyses: (params: { page: number, limit: number, search?: string }) => Promise<GetAnalysesResponseDTO>
  updateAnalysis: (id: string, dto: CreateAnalysisBodyDTO) => Promise<UpdateAnalysisResponseDTO>
  deleteAnalysis: (id: string) => Promise<void>
  createCriteria: (analysisId: string, dto: CreateCriteriaBodyDTO) => Promise<CreateCriteriaResponseDTO>
  getCriteria: (analysisId: string) => Promise<GetCriteriaResponseDTO>
  updateCriteria: (analysisId: string, dto: UpdateCriteriaBodyDTO) => Promise<UpdateCriteriaResponseDTO>
  getAlternatives: (analysisId: string) => Promise<GetAlternativesResponseDTO>
  updateAlternatives: (analysisId: string, dto: UpdateAlternativesBodyDTO) => Promise<UpdateAlternativesResponseDTO>
}

export const useAnalysisApi = (): AnalysisApi => {
  const requestFetch = useRequestFetch()

  const createAnalysis = async (dto: CreateAnalysisBodyDTO) => {
    return await $fetch<CreateAnalysisResponseDTO>('/api/analyses', { method: 'POST', body: dto })
  }

  const getAnalysis = async (id: string) => {
    return await $fetch<GetAnalysisResponseDTO>(`/api/analyses/${id}`, { method: 'GET' })
  }

  const fetchAnalyses = async (params: { page: number, limit: number, search?: string }) => {
    return await requestFetch<GetAnalysesResponseDTO>('/api/analyses', { method: 'GET', query: params })
  }

  const updateAnalysis = async (id: string, dto: CreateAnalysisBodyDTO) => {
    return await $fetch<UpdateAnalysisResponseDTO>(`/api/analyses/${id}`, { method: 'PUT', body: dto })
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

  const getAlternatives = async (analysisId: string) => {
    return await $fetch<GetAlternativesResponseDTO>(`/api/analyses/${analysisId}/alternatives`, { method: 'GET' })
  }

  const updateAlternatives = async (analysisId: string, dto: UpdateAlternativesBodyDTO) => {
    return await $fetch<UpdateAlternativesResponseDTO>(`/api/analyses/${analysisId}/alternatives`, { method: 'PUT', body: dto })
  }

  return {
    createAnalysis,
    getAnalysis,
    fetchAnalyses,
    updateAnalysis,
    deleteAnalysis,
    createCriteria,
    getCriteria,
    updateCriteria,
    getAlternatives,
    updateAlternatives
  }
}
