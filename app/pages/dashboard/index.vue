<script setup lang="ts">
import { h, resolveComponent } from 'vue'
import type { TableColumn } from '@nuxt/ui'
import type { Row } from '@tanstack/vue-table'
import type { AnalysisItemDTO } from '#shared/types/analysis'

const UButton = resolveComponent('UButton')
const UDropdownMenu = resolveComponent('UDropdownMenu')

definePageMeta({
  middleware: ['auth'],
  layout: 'dashboard'
})

const localePath = useLocalePath()
const { t } = useI18n()
const toast = useToast()

const globalFilter = ref('')

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
  },
  {
    id: 'actions',
    header: '',
    meta: {
      class: {
        th: 'w-10',
        td: 'text-right'
      }
    },
    cell: ({ row }) => {
      return h(
        UDropdownMenu,
        {
          'content': {
            align: 'end'
          },
          'items': getRowItems(row),
          'aria-label': t('common.actions')
        },
        () =>
          h(UButton, {
            'icon': 'i-lucide-ellipsis-vertical',
            'color': 'neutral',
            'variant': 'ghost',
            'size': 'sm',
            'aria-label': t('common.actions')
          })
      )
    }
  }
]

const getRowItems = (row: Row<AnalysisItemDTO>) => {
  return [
    {
      type: 'label',
      label: t('common.actions')
    },
    {
      label: t('common.view'),
      icon: 'i-lucide-eye',
      onSelect() {
        navigateTo(localePath(`/analyses/${row.original.id}`))
      }
    },
    {
      label: t('common.edit'),
      icon: 'i-lucide-pencil',
      onSelect() {
        // TODO: Implement edit
        toast.add({
          title: t('common.comingSoon'),
          color: 'info'
        })
      }
    },
    {
      type: 'separator'
    },
    {
      label: t('common.delete'),
      icon: 'i-lucide-trash-2',
      color: 'error',
      onSelect() {
        // TODO: Implement delete
        toast.add({
          title: t('common.comingSoon'),
          color: 'info'
        })
      }
    }
  ]
}
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
      <div class="flex px-4 py-3.5 border-b border-accented">
        <UInput v-model="globalFilter" class="max-w-sm" :placeholder="t('common.filter')" />
      </div>
      <UTable v-model:global-filter="globalFilter"
              sticky
              :data="data"
              :columns="columns"
              :loading="status === 'pending'"
              class="flex-1 max-h-[600px]"
      />
    </UCard>
  </div>
</template>
