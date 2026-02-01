export interface UseToastNotificationComposable {
  showSuccess: (titleKey: string, messageKey?: string) => void
  showError: (titleKey: string, messageKey?: string) => void
}

export const useToastNotification = (): UseToastNotificationComposable => {
  const { t } = useI18n()
  const toast = useToast()

  const showSuccess = (titleKey: string, messageKey?: string): void => {
    toast.add({
      title: t(titleKey),
      description: messageKey ? t(messageKey) : undefined,
      color: 'success'
    })
  }

  const showError = (titleKey: string, messageKey?: string): void => {
    toast.add({
      title: t(titleKey),
      description: messageKey ? t(messageKey) : undefined,
      color: 'error'
    })
  }

  return { showSuccess, showError }
}
