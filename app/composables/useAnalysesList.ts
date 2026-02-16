import { ref, computed } from 'vue'
import type { Ref, ComputedRef } from 'vue'
import { useAsyncData } from '#imports'
import type { AnalysisItemDTO, GetAnalysesResponseDTO } from '#shared/types/analysis'
import { useToastNotification } from './useToastNotification'
import { useAnalysisApi } from './useAnalysisApi'

export interface UseAnalysesListComposable {
  page: Ref<number>
  limit: Ref<number>
  searchInput: Ref<string>
  activeSearch: Ref<string>
  analyses: ComputedRef<AnalysisItemDTO[]>
  pagination: ComputedRef<GetAnalysesResponseDTO['pagination'] | undefined>
  pending: Ref<boolean>
  error: Ref<unknown>
  isDeleteOpen: Ref<boolean>
  analysisToDelete: Ref<AnalysisItemDTO | null>

  onPageChange: (newPage: number) => void
  searchAnalyses: () => void
  clearSearch: () => void
  refresh: () => Promise<void>
  openDeleteModal: (analysis: AnalysisItemDTO) => void
  closeDeleteModal: () => void
  confirmDelete: () => Promise<void>
}

export const useAnalysesList = (): UseAnalysesListComposable => {
  const page = ref(1)
  const limit = ref(10)
  const activeSearch = ref('')
  const searchInput = ref('')
  const isDeleteOpen = ref(false)
  const analysisToDelete = ref<AnalysisItemDTO | null>(null)

  const { showSuccess, showError } = useToastNotification()
  const { fetchAnalyses, deleteAnalysis } = useAnalysisApi()

  const { data, pending, error, refresh } = useAsyncData('analyses-list', () =>
    fetchAnalyses({
      page: page.value,
      limit: limit.value,
      search: activeSearch.value || undefined
    }),
  {
    server: false,
    lazy: true
  })

  const onPageChange = (newPage: number) => {
    page.value = newPage
    refresh()
  }

  const searchAnalyses = () => {
    activeSearch.value = searchInput.value || ''
    page.value = 1
    refresh()
  }

  const clearSearch = () => {
    searchInput.value = ''
    activeSearch.value = ''
    page.value = 1
    refresh()
  }

  const openDeleteModal = (analysis: AnalysisItemDTO) => {
    analysisToDelete.value = analysis
    isDeleteOpen.value = true
  }

  const closeDeleteModal = () => {
    isDeleteOpen.value = false
    analysisToDelete.value = null
  }

  const confirmDelete = async () => {
    if (!analysisToDelete.value) {
      return
    }
    try {
      await deleteAnalysis(analysisToDelete.value.id)
      showSuccess('analysis.delete.success')
      searchAnalyses()
    } catch (error: unknown) {
      if ((error as { status?: number })?.status === 404) {
        showError('analysis.delete.notFound')
        searchAnalyses()
      } else {
        showError('errors.analysis.delete.title', 'errors.analysis.delete.description')
      }
    } finally {
      closeDeleteModal()
    }
  }

  const analyses = computed(() => data.value?.data || [])
  const pagination = computed(() => data.value?.pagination)

  return {
    page,
    limit,
    searchInput,
    activeSearch,
    analyses,
    pagination,
    pending,
    error,
    isDeleteOpen,
    analysisToDelete,
    onPageChange,
    searchAnalyses,
    clearSearch,
    refresh,
    openDeleteModal,
    closeDeleteModal,
    confirmDelete
  }
}
