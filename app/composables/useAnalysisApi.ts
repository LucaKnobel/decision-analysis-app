export const useAnalysisApi = () => {
  const createAnalysis = async (dto: CreateAnalysisRequestDTO) => {
    return await $fetch('/api/analyses', {
      method: 'POST',
      body: dto
    })
  }

  const getAnalyses = async (params: GetAnalysesRequestDTO) => {
    return await $fetch<GetAnalysesResponseDTO>('/api/analyses', {
      method: 'GET',
      query: params
    })
  }

  return { createAnalysis,
    getAnalyses
  }
}
