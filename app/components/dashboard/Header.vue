<script setup lang="ts">
import { computed } from 'vue'

const { t, locale, setLocale } = useI18n()
const {
  isDeleteModalOpen,
  isDeleting,
  openDeleteModal,
  closeDeleteModal,
  confirmDeleteAccount,
  logout
} = useAccountActions()

const menuItems = computed(() => [
  {
    type: 'label' as const,
    label: t('common.actions')
  },
  {
    label: t('nav.logout'),
    icon: 'i-lucide-log-out',
    onSelect: logout
  },
  {
    label: t('account.delete.action'),
    icon: 'i-lucide-user-x',
    color: 'error' as const,
    disabled: isDeleting.value,
    onSelect: openDeleteModal
  },
  {
    type: 'separator' as const
  },
  {
    type: 'label' as const,
    label: t('common.language')
  },
  {
    label: 'Deutsch',
    icon: locale.value === 'de' ? 'i-lucide-check' : undefined,
    onSelect() {
      setLocale('de')
    }
  },
  {
    label: 'English',
    icon: locale.value === 'en' ? 'i-lucide-check' : undefined,
    onSelect() {
      setLocale('en')
    }
  }
])
</script>

<template>
  <UHeader>
    <template #left>
      <AppLogo />
    </template>
    <template #right>
      <UColorModeButton />
      <div class="hidden lg:flex items-center">
        <UDropdownMenu
          :items="menuItems"
          :content="{ align: 'end' }"
          :ui="{ content: 'w-56' }"
        >
          <UButton
            icon="i-lucide-ellipsis-vertical"
            color="neutral"
            variant="ghost"
            size="sm"
            :aria-label="t('common.actions')"
          />
        </UDropdownMenu>
      </div>
    </template>
    <template #body>
      <div class="flex flex-col gap-2 p-4 items-center w-full">
        <AppLogoutButton />
        <AppDeleteAccountButton />
        <AppLocaleSelect />
      </div>
    </template>
  </UHeader>
  <UModal
    v-model:open="isDeleteModalOpen"
    :title="t('account.delete.title')"
    :description="t('account.delete.description')"
    :ui="{ footer: 'justify-end' }"
  >
    <template #footer>
      <UButton
        :label="t('common.cancel')"
        color="neutral"
        variant="outline"
        :disabled="isDeleting"
        @click="closeDeleteModal"
      />
      <UButton
        :label="t('account.delete.confirm')"
        color="error"
        :loading="isDeleting"
        @click="confirmDeleteAccount"
      />
    </template>
  </UModal>
</template>
