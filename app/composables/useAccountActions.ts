import { ref } from 'vue'
import type { Ref } from 'vue'

export interface UseAccountActionsComposable {
  isDeleteModalOpen: Ref<boolean>
  isDeleting: Ref<boolean>
  openDeleteModal: () => void
  closeDeleteModal: () => void
  confirmDeleteAccount: () => Promise<void>
  logout: () => Promise<void>
}

export const useAccountActions = (): UseAccountActionsComposable => {
  const localePath = useLocalePath()
  const { clear: clearSession } = useUserSession()
  const { deleteAccount } = useAuthApi()
  const { showSuccess } = useToastNotification()
  const { handleAccountDeleteError } = useErrorHandler()

  const isDeleteModalOpen = ref(false)
  const isDeleting = ref(false)

  const openDeleteModal = (): void => {
    isDeleteModalOpen.value = true
  }

  const closeDeleteModal = (): void => {
    if (!isDeleting.value) {
      isDeleteModalOpen.value = false
    }
  }

  const confirmDeleteAccount = async (): Promise<void> => {
    if (isDeleting.value) {
      return
    }

    isDeleting.value = true
    try {
      await deleteAccount()
      await clearSession()
      showSuccess('account.delete.successTitle', 'account.delete.successText')
      await navigateTo(localePath('/'))
    } catch (error: unknown) {
      const { titleKey, textKey } = handleAccountDeleteError(error)
      const { showError } = useToastNotification()
      showError(titleKey, textKey)
    } finally {
      isDeleting.value = false
      isDeleteModalOpen.value = false
    }
  }

  const logout = async (): Promise<void> => {
    await clearSession()
    await navigateTo(localePath('/'))
  }

  return {
    isDeleteModalOpen,
    isDeleting,
    openDeleteModal,
    closeDeleteModal,
    confirmDeleteAccount,
    logout
  }
}
