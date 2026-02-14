<script setup lang="ts">
import { h, resolveComponent } from 'vue'
import type { TableColumn } from '@nuxt/ui'
import type { Row } from '@tanstack/vue-table'

const UButton = resolveComponent('UButton')
const UDropdownMenu = resolveComponent('UDropdownMenu')

definePageMeta({
  middleware: ['auth'],
  layout: 'dashboard'
})

const localePath = useLocalePath()
const { t } = useI18n()

const {
  page,
  limit,
  searchInput,
  analyses,
  pagination,
  pending,
  isDeleteOpen,
  analysisToDelete,
  onPageChange,
  searchAnalyses,
  clearSearch,
  openDeleteModal,
  confirmDelete
} = useAnalyses()

const columns: TableColumn<AnalysisItemDTO>[] = [
  {
    accessorKey: 'title',
    header: () => t('analysis.title'),
    cell: ({ row }) => row.original.title,
    meta: {
      class: {
        th: 'w-48 max-w-[12rem] truncate',
        td: 'w-48 max-w-[12rem] truncate whitespace-nowrap overflow-ellipsis overflow-hidden align-middle'
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
        navigateTo(localePath(`/analyses/${row.original.id}/edit`))
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
        openDeleteModal(row.original)
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
            variant="subtle"
          />
        </div>
      </template>
      <div class="flex px-4 py-3.5 border-b border-accented gap-2 items-center">
        <UInput
          v-model="searchInput"
          class="max-w-sm"
          :placeholder="t('common.search')"
          :ui="{ trailing: 'pe-1' }"
          @keyup.enter="searchAnalyses"
        >
          <template
            v-if="searchInput?.length"
            #trailing
          >
            <UButton
              color="neutral"
              variant="link"
              size="sm"
              icon="i-lucide-circle-x"
              aria-label="Clear input"
              @click="clearSearch"
            />
          </template>
        </UInput>
        <UButton
          icon="i-lucide-search"
          color="primary"
          variant="subtle"
          class="shrink-0"
          @click="searchAnalyses"
        />
      </div>
      <div class="h-100 flex flex-col">
        <ClientOnly>
          <UTable
            sticky
            :data="analyses"
            :columns="columns"
            :loading="pending"
            class="flex-1 max-h-150"
            :empty="$t('common.noData')"
          />
        </ClientOnly>
      </div>
    </UCard>
    <div
      v-if="pagination && pagination.totalPages > 1"
      class="flex justify-center px-4 py-4 border-t border-accented"
    >
      <UPagination
        :page="page"
        :total="pagination.total"
        :items-per-page="limit"
        show-edges
        variant="soft"
        active-color="primary"
        active-variant="subtle"
        @update:page="onPageChange"
      />
    </div>
  </div>
  <UModal
    v-model:open="isDeleteOpen"
    :title="t('analysis.delete.title')"
    :description="t('analysis.delete.description')"
    :ui="{ footer: 'justify-end' }"
  >
    <template #body>
      <div class="py-4">
        <p class="text-sm text-gray-600 dark:text-gray-400 whitespace-normal wrap-break-word">
          <strong>{{ analysisToDelete?.title }}</strong>
        </p>
      </div>
    </template>

    <template #footer="{ close }">
      <UButton
        :label="t('common.cancel')"
        color="neutral"
        variant="outline"
        @click="close"
      />
      <UButton
        :label="t('common.delete')"
        color="error"
        @click="confirmDelete"
      />
    </template>
  </UModal>
</template>
