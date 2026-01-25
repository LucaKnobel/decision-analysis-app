<!-- <script setup lang="ts">
import type { TableColumn } from '@nuxt/ui'
import type { AnalysisItemDTO } from '#shared/types/analysis'

definePageMeta({
  middleware: ['auth'],
  layout: 'dashboard'
})

const localePath = useLocalePath()
const { t } = useI18n()

const { data: analyses, status } = await useFetch<{ data: AnalysisItemDTO[] }>('/api/analyses', {
  key: 'dashboard-analyses',
  transform: (response) => response.data || [],
  lazy: true
})

const columns: TableColumn<AnalysisItemDTO>[] = [
  {
    accessorKey: 'title',
    header: () => t('analysis.title')
  },
  {
    accessorKey: 'description',
    header: () => t('analysis.description'),
    cell: ({ row }) => row.original.description || '-'
  },
  {
    accessorKey: 'createdAt',
    header: () => t('analysis.columns.createdAt'),
    cell: ({ row }) => {
      return new Date(row.original.createdAt).toLocaleString('de-DE', {
        day: 'numeric',
        month: 'short',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      })
    }
  },
  {
    accessorKey: 'updatedAt',
    header: () => t('analysis.columns.updatedAt'),
    cell: ({ row }) => {
      return new Date(row.original.updatedAt).toLocaleString('de-DE', {
        day: 'numeric',
        month: 'short',
        year: 'numeric'
      })
    }
  }
]

const handleRowClick = (row: AnalysisItemDTO) => {
  navigateTo(localePath(`/analyses/${row.id}`))
}
</script>

<template>
  <div class="max-w-7xl mx-auto">
    <UCard>
      <template #header>
        <div class="flex justify-between items-center">
          <h2 class="text-xl font-semibold">
            {{ t('analysis.dashboard.title') }}
          </h2>
          <UButton
            :label="$t('analysis.create.title')"
            :to="localePath('/analyses/create')"
            leading-icon="i-lucide-plus"
            size="md"
            color="primary"
            variant="solid"
          />
        </div>
      </template>

      <UTable
        :data="analyses"
        :columns="columns"
        :loading="status === 'pending'"
        class="flex-1"
        @row-click="handleRowClick"
      >
        <template #empty>
          <div class="flex flex-col items-center justify-center py-12">
            <UIcon name="i-lucide-inbox" class="w-12 h-12 text-gray-400 mb-3" />
            <p class="text-gray-500 dark:text-gray-400">
              {{ t('analysis.dashboard.empty') }}
            </p>
            <UButton
              :to="localePath('/analyses/create')"
              class="mt-4"
              size="sm"
              variant="soft"
            >
              {{ t('analysis.dashboard.createFirst') }}
            </UButton>
          </div>
        </template>
      </UTable>
    </UCard>
  </div>
</template>
 -->
