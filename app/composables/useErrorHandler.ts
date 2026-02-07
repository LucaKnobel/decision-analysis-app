import { ref } from 'vue'
import type { Ref } from 'vue'
import { useI18n } from '#imports'

export interface UseErrorHandlerComposable {
  hasError: Ref<boolean>
  errorTitle: Ref<string | undefined>
  errorText: Ref<string | undefined>
  resetError: () => void
  handleRegistrationError: (error: unknown) => void
  handleLoginError: (error: unknown) => void
  handleAnalysisError: (error: unknown) => void
  handleCriteriaError: (error: unknown) => void
}

export const useErrorHandler = (): UseErrorHandlerComposable => {
  const { t } = useI18n()
  const hasError = ref(false)
  const errorTitle = ref<string | undefined>(undefined)
  const errorText = ref<string | undefined>(undefined)

  const setError = (titleKey: string, textKey: string): void => {
    errorTitle.value = t(titleKey)
    errorText.value = t(textKey)
    hasError.value = true
  }

  const resetError = (): void => {
    errorTitle.value = undefined
    errorText.value = undefined
    hasError.value = false
  }

  const getStatusCode = (error: unknown): number | undefined => {
    const statusCode = (error as { statusCode?: number } | null)?.statusCode
    return typeof statusCode === 'number' ? statusCode : undefined
  }

  const handleCommonErrors = (statusCode: number | undefined): boolean => {
    if (!statusCode) {
      setError('errors.network.title', 'errors.network.text')
      return true
    }

    if (statusCode >= 500) {
      setError('errors.serviceUnavailable.title', 'errors.serviceUnavailable.text')
      return true
    }

    return false
  }

  const handleRegistrationError = (error: unknown): void => {
    const statusCode = getStatusCode(error)
    if (handleCommonErrors(statusCode)) {
      return
    }
    setError('errors.registration.title', 'errors.registration.text')
  }

  const handleLoginError = (error: unknown): void => {
    const statusCode = getStatusCode(error)
    if (handleCommonErrors(statusCode)) {
      return
    }
    setError('errors.login.title', 'errors.login.text')
  }

  const handleAnalysisError = (error: unknown): void => {
    const statusCode = getStatusCode(error)
    if (handleCommonErrors(statusCode)) {
      return
    }
    setError('errors.analysis.title', 'errors.analysis.text')
  }

  const handleCriteriaError = (error: unknown): void => {
    const statusCode = getStatusCode(error)
    if (handleCommonErrors(statusCode)) {
      return
    }
    setError('errors.criteria.title', 'errors.criteria.text')
  }

  return {
    hasError,
    errorTitle,
    errorText,
    resetError,
    handleRegistrationError,
    handleLoginError,
    handleAnalysisError,
    handleCriteriaError
  }
}
