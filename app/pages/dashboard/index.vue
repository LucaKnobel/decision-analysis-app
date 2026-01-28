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

const searchInput = ref('')
const activeSearch = ref('')
const page = ref(1)
const limit = 10

const { data: response, status } = await useFetch<{
  data: AnalysisItemDTO[]
  pagination: {
    total: number
    totalPages: number
    currentPage: number
    limit: number
  }
}>(
  '/api/analyses',
  {
    query: computed(() => ({
      page: page.value,
      limit,
      search: activeSearch.value || undefined
    }))
  }
)

const data = computed(() => response.value?.data || [])
const pagination = computed(() => response.value?.pagination)
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

const onSearch = () => {
  activeSearch.value = searchInput.value || ''
  page.value = 1
}

const clearSearch = () => {
  searchInput.value = ''
  activeSearch.value = ''
  page.value = 1
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
      <ClientOnly>
        <div class="flex px-4 py-3.5 border-b border-accented gap-2 items-center">
          <UInput
            v-model="searchInput"
            class="max-w-sm"
            :placeholder="t('common.search')"
            :ui="{ trailing: 'pe-1' }"
            @keyup.enter="onSearch"
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
            @click="onSearch"
          />
        </div>
        <div class="h-100 flex flex-col">
          <UTable
            sticky
            :data="data"
            :columns="columns"
            :loading="status === 'pending'"
            class="flex-1 max-h-150"
            :empty="$t('common.noData')"
          />
        </div>
      </ClientOnly>
    </UCard>
    <div
      v-if="pagination && pagination.totalPages > 1"
      class="flex justify-center px-4 py-4 border-t border-accented"
    >
      <UPagination
        v-model:page="page"
        :total="pagination.total"
        :items-per-page="limit"
        show-edges
        variant="soft"
        active-color="primary"
        active-variant="subtle"
      />
    </div>
  </div>
</template>
