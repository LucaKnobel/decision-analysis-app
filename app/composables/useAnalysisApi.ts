export interface AnalysisApi {
  createAnalysis: (dto: CreateAnalysisRequestDTO) => Promise<CreateAnalysisResponseDTO>
  fetchAnalyses: (params: { page: number, limit: number, search?: string }) => Promise<GetAnalysesResponseDTO>
}

export const useAnalysisApi = (): AnalysisApi => {
  const requestFetch = useRequestFetch()

  const createAnalysis: AnalysisApi['createAnalysis'] = async (dto) => {
    return await $fetch('/api/analyses', {
      method: 'POST',
      body: dto
    })
  }

  const fetchAnalyses: AnalysisApi['fetchAnalyses'] = async (params) => {
    return await requestFetch('/api/analyses', { method: 'GET', query: params })
  }

  return {
    createAnalysis,
    fetchAnalyses
  }
}
