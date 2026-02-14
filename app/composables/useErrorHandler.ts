import { ref } from 'vue'
import type { Ref } from 'vue'
import { useI18n } from '#imports'

export interface UseErrorHandlerComposable {
  hasError: Ref<boolean>
  errorTitle: Ref<string | undefined>
  errorText: Ref<string | undefined>
  resetError: () => void
  handleRegistrationError: (error: unknown) => { titleKey: string, textKey: string }
  handleLoginError: (error: unknown) => { titleKey: string, textKey: string }
  handleAnalysisError: (error: unknown) => { titleKey: string, textKey: string }
  handleCriteriaError: (error: unknown) => { titleKey: string, textKey: string }
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

  const handleCommonErrors = (statusCode: number | undefined): { titleKey: string, textKey: string } | null => {
    if (!statusCode) {
      const titleKey = 'errors.network.title'
      const textKey = 'errors.network.text'
      setError(titleKey, textKey)
      return { titleKey, textKey }
    }

    if (statusCode >= 500) {
      const titleKey = 'errors.serviceUnavailable.title'
      const textKey = 'errors.serviceUnavailable.text'
      setError(titleKey, textKey)
      return { titleKey, textKey }
    }

    return null
  }

  const handleRegistrationError = (error: unknown): { titleKey: string, textKey: string } => {
    const statusCode = getStatusCode(error)
    const commonError = handleCommonErrors(statusCode)
    if (commonError) {
      return commonError
    }
    const titleKey = 'errors.registration.title'
    const textKey = 'errors.registration.text'
    setError(titleKey, textKey)
    return { titleKey, textKey }
  }

  const handleLoginError = (error: unknown): { titleKey: string, textKey: string } => {
    const statusCode = getStatusCode(error)
    const commonError = handleCommonErrors(statusCode)
    if (commonError) {
      return commonError
    }
    const titleKey = 'errors.login.title'
    const textKey = 'errors.login.text'
    setError(titleKey, textKey)
    return { titleKey, textKey }
  }

  const handleAnalysisError = (error: unknown): { titleKey: string, textKey: string } => {
    const statusCode = getStatusCode(error)
    const commonError = handleCommonErrors(statusCode)
    if (commonError) {
      return commonError
    }
    const titleKey = 'errors.analysis.title'
    const textKey = 'errors.analysis.text'
    setError(titleKey, textKey)
    return { titleKey, textKey }
  }

  const handleCriteriaError = (error: unknown): { titleKey: string, textKey: string } => {
    const statusCode = getStatusCode(error)
    const commonError = handleCommonErrors(statusCode)
    if (commonError) {
      return commonError
    }
    const titleKey = 'errors.criteria.title'
    const textKey = 'errors.criteria.text'
    setError(titleKey, textKey)
    return { titleKey, textKey }
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
