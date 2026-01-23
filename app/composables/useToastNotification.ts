import { useI18n } from 'vue-i18n'
// @ts-expect-error - useToast is auto-imported by Nuxt
import { useToast } from '@nuxt/ui/dist/runtime/composables/useToast'

export const useToastNotification = () => {
  const { t } = useI18n()
  const toast = useToast()

  const showSuccess = (titleKey: string, messageKey: string): void => {
    toast.add({
      title: t(titleKey),
      description: t(messageKey),
      color: 'success'
    })
  }

  const showError = (titleKey: string, messageKey: string): void => {
    toast.add({
      title: t(titleKey),
      description: t(messageKey),
      color: 'error'
    })
  }

  return { showSuccess, showError }
}
