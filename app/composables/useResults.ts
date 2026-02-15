import { ref } from 'vue'
import { useAnalysisApi } from './useAnalysisApi'
import { useErrorHandler } from './useErrorHandler'
import type { Ref } from 'vue'
import type { GetResultsResponseDTO, ResultItemDTO, ResultCriterionDTO } from '#shared/types/results'

export interface UseResultsComposable {
  results: Ref<ResultItemDTO[]>
  criteria: Ref<ResultCriterionDTO[]>
  weightSum: Ref<number>
  isLoading: Ref<boolean>
  hasError: Ref<boolean>
  errorTitle: Ref<string | undefined>
  errorText: Ref<string | undefined>
  loadResults: () => Promise<void>
}

export const useResults = (analysisId: Ref<string | undefined>): UseResultsComposable => {
  const { getResults } = useAnalysisApi()
  const { hasError, errorTitle, errorText, resetError, handleResultsError } = useErrorHandler()

  const results = ref<ResultItemDTO[]>([])
  const criteria = ref<ResultCriterionDTO[]>([])
  const weightSum = ref(0)
  const isLoading = ref(false)

  const loadResults = async () => {
    const id = analysisId.value
    if (!id) {
      return
    }

    resetError()
    isLoading.value = true
    try {
      const response: GetResultsResponseDTO = await getResults(id)
      results.value = response.results
      criteria.value = response.criteria
      weightSum.value = response.weightSum
    } catch (error: unknown) {
      handleResultsError(error)
    } finally {
      isLoading.value = false
    }
  }

  return {
    results,
    criteria,
    weightSum,
    isLoading,
    hasError,
    errorTitle,
    errorText,
    loadResults
  }
}
