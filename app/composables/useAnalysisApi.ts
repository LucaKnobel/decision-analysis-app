export const useAnalysisApi = () => {
  const requestFetch = useRequestFetch()

  const createAnalysis = async (dto: CreateAnalysisRequestDTO): Promise<CreateAnalysisResponseDTO> => {
    return await $fetch<CreateAnalysisResponseDTO>('/api/analyses', {
      method: 'POST',
      body: dto
    })
  }

  const fetchAnalyses = async (params: { page: number, limit: number, search?: string }): Promise<GetAnalysesResponseDTO> => {
    return await requestFetch<GetAnalysesResponseDTO>('/api/analyses', { method: 'GET', query: params })
  }

  return {
    createAnalysis,
    fetchAnalyses
  }
}
