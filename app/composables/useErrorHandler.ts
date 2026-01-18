export const useErrorHandler = () => {
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

  const handleRegistrationError = (error: unknown): void => {
    const statusCode = getStatusCode(error)

    if (!statusCode) {
      setError('errors.network.title', 'errors.network.text')
      return
    }

    if (statusCode >= 500) {
      setError('errors.serviceUnavailable.title', 'errors.serviceUnavailable.text')
      return
    }

    setError('errors.registration.title', 'errors.registration.text')
  }

  const handleLoginError = (error: unknown): void => {
    const statusCode = getStatusCode(error)

    if (!statusCode) {
      setError('errors.network.title', 'errors.network.text')
      return
    }

    if (statusCode >= 500) {
      setError('errors.serviceUnavailable.title', 'errors.serviceUnavailable.text')
      return
    }

    if (statusCode === 401) {
      setError('errors.login.title', 'errors.login.text')
      return
    }
  }

  const handleAnalysisError = (error: unknown): void => {
    const statusCode = getStatusCode(error)

    if (!statusCode) {
      setError('errors.network.title', 'errors.network.text')
      return
    }

    if (statusCode >= 500) {
      setError('errors.serviceUnavailable.title', 'errors.serviceUnavailable.text')
      return
    }

    if (statusCode === 401) {
      setError('errors.analysis.title', 'errors.analysis.text')
      return
    }
  }

  return {
    hasError,
    errorTitle,
    errorText,
    resetError,
    handleRegistrationError,
    handleLoginError,
    handleAnalysisError
  }
}
