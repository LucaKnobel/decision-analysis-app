import { ref } from 'vue'
import type { Ref } from 'vue'
import type { CreateAnalysisBodyDTO, GetAnalysisResponseDTO } from '#shared/types/analysis'
import { useAnalysisApi } from './useAnalysisApi'
import { useErrorHandler } from './useErrorHandler'

export interface UseAnalysisDetailComposable {
  currentAnalysis: Ref<GetAnalysisResponseDTO | null>
  loadingAnalysis: Ref<boolean>
  submittingAnalysis: Ref<boolean>
  hasError: Ref<boolean>
  errorTitle: Ref<string | undefined>
  errorText: Ref<string | undefined>

  loadAnalysis: (id: string) => Promise<void>
  saveAnalysis: (id: string, dto: CreateAnalysisBodyDTO) => Promise<void>
  resetError: () => void
}

export const useAnalysisDetail = (): UseAnalysisDetailComposable => {
  const currentAnalysis = ref<GetAnalysisResponseDTO | null>(null)
  const loadingAnalysis = ref(false)
  const submittingAnalysis = ref(false)

  const { getAnalysis, updateAnalysis } = useAnalysisApi()
  const { handleAnalysisError, resetError, hasError, errorTitle, errorText } = useErrorHandler()

  const loadAnalysis = async (id: string) => {
    try {
      resetError()
      loadingAnalysis.value = true
      const analysis = await getAnalysis(id)
      currentAnalysis.value = analysis
    } catch (error: unknown) {
      handleAnalysisError(error)
    } finally {
      loadingAnalysis.value = false
    }
  }

  const saveAnalysis = async (id: string, dto: CreateAnalysisBodyDTO) => {
    try {
      resetError()
      submittingAnalysis.value = true
      await updateAnalysis(id, dto)
    } catch (error: unknown) {
      handleAnalysisError(error)
    } finally {
      submittingAnalysis.value = false
    }
  }

  return {
    currentAnalysis,
    loadingAnalysis,
    submittingAnalysis,
    hasError,
    errorTitle,
    errorText,
    loadAnalysis,
    saveAnalysis,
    resetError
  }
}
