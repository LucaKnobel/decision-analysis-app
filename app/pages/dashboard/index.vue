<script setup lang="ts">
import type { TableColumn } from '@nuxt/ui'
import type { AnalysisItemDTO } from '#shared/types/analysis'

definePageMeta({
  middleware: ['auth'],
  layout: 'dashboard'
})

const localePath = useLocalePath()
const { t } = useI18n()

const { data: response, status } = await useFetch<{ data: AnalysisItemDTO[] }>('/api/analyses', {
  key: 'dashboard-analyses',
  lazy: true
})
const data = computed(() => response.value?.data || [])
const columns: TableColumn<AnalysisItemDTO>[] = [
  {
    accessorKey: 'title',
    header: () => t('analysis.title'),
    cell: ({ row }) => row.original.title,
    meta: {
      class: {
        th: 'w-24',
        td: 'w-24 truncate'
      }
    }
  },
  {
    accessorKey: 'description',
    header: () => t('analysis.description'),
    cell: ({ row }) => row.original.description || '-',
    meta: {
      class: {
        th: 'hidden md:table-cell',
        td: 'hidden md:table-cell truncate max-w-md'
      }
    }
  },
  {
    accessorKey: 'createdAt',
    header: () => t('analysis.columns.createdAt'),
    cell: ({ row }) => new Date(row.original.createdAt).toLocaleDateString('de-DE'),
    meta: {
      class: {
        th: 'w-32 hidden lg:table-cell',
        td: 'w-32 hidden lg:table-cell'
      }
    }
  },
  {
    accessorKey: 'updatedAt',
    header: () => t('analysis.columns.updatedAt'),
    cell: ({ row }) => new Date(row.original.updatedAt).toLocaleDateString('de-DE'),
    meta: {
      class: {
        th: 'w-32 hidden md:table-cell',
        td: 'w-32 hidden md:table-cell'
      }
    }
  }
]

/* const handleRowClick = (row: AnalysisItemDTO) => {
  navigateTo(localePath(`/analyses/${row.id}`))
} */
</script>

<template>
  <div class="container max-w-7xl mx-auto px-4 py-6 sm:px-6 lg:px-8">
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
      <UTable :data="data"
              :columns="columns"
              :loading="status === 'pending'"
              class="w-full"
      />
    </UCard>
  </div>
</template>
