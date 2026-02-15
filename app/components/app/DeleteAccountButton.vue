<script setup lang="ts">
const {
  isDeleteModalOpen,
  isDeleting,
  openDeleteModal,
  closeDeleteModal,
  confirmDeleteAccount
} = useAccountActions()
</script>

<template>
  <div class="flex flex-col items-stretch">
    <UButton
      :label="$t('account.delete.action')"
      icon="i-lucide-user-x"
      size="md"
      color="error"
      variant="ghost"
      @click="openDeleteModal"
    />

    <UModal
      v-model:open="isDeleteModalOpen"
      :title="$t('account.delete.title')"
      :description="$t('account.delete.description')"
      :ui="{ footer: 'justify-end' }"
    >
      <template #footer>
        <UButton
          :label="$t('common.cancel')"
          color="neutral"
          variant="outline"
          :disabled="isDeleting"
          @click="closeDeleteModal"
        />
        <UButton
          :label="$t('account.delete.confirm')"
          color="error"
          :loading="isDeleting"
          @click="confirmDeleteAccount"
        />
      </template>
    </UModal>
  </div>
</template>
