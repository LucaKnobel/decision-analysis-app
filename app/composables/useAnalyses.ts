import { ref, computed } from 'vue'
import type { Ref, ComputedRef } from 'vue'
import { useAsyncData } from '#imports'
import type { AnalysisItemDTO, GetAnalysesResponseDTO, GetAnalysisResponseDTO, CreateAnalysisBodyDTO } from '#shared/types/analysis'
import { useToastNotification } from './useToastNotification'
import { useAnalysisApi } from './useAnalysisApi'
import { useErrorHandler } from './useErrorHandler'

export interface UseAnalysesComposable {
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
  currentAnalysis: Ref<GetAnalysisResponseDTO | null>
  loadingAnalysis: Ref<boolean>
  submittingAnalysis: Ref<boolean>
  hasError: Ref<boolean>
  errorTitle: Ref<string | undefined>
  errorText: Ref<string | undefined>

  onPageChange: (newPage: number) => void
  searchAnalyses: () => void
  clearSearch: () => void
  refresh: () => Promise<void>
  openDeleteModal: (analysis: AnalysisItemDTO) => void
  closeDeleteModal: () => void
  confirmDelete: () => Promise<void>
  loadAnalysis: (id: string) => Promise<void>
  saveAnalysis: (id: string, dto: CreateAnalysisBodyDTO) => Promise<void>
  resetError: () => void
}

export const useAnalyses = (): UseAnalysesComposable => {
  const page = ref(1)
  const limit = ref(10)
  const activeSearch = ref('')
  const searchInput = ref('')
  const isDeleteOpen = ref(false)
  const analysisToDelete = ref<AnalysisItemDTO | null>(null)
  const currentAnalysis = ref<GetAnalysisResponseDTO | null>(null)
  const loadingAnalysis = ref(false)
  const submittingAnalysis = ref(false)

  const { showSuccess, showError } = useToastNotification()
  const { fetchAnalyses, deleteAnalysis, getAnalysis, updateAnalysis } = useAnalysisApi()
  const { handleAnalysisError, resetError, hasError, errorTitle, errorText } = useErrorHandler()

  const { data, pending, error, refresh } = useAsyncData('analyses', () =>
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

  const loadAnalysis = async (id: string) => {
    try {
      resetError()
      loadingAnalysis.value = true
      const analysis = await getAnalysis(id)
      currentAnalysis.value = analysis
    } catch (error: unknown) {
      handleAnalysisError(error)
    } finally {
      loadingAnalysis.value = false
    }
  }

  const saveAnalysis = async (id: string, dto: CreateAnalysisBodyDTO) => {
    try {
      resetError()
      submittingAnalysis.value = true
      await updateAnalysis(id, dto)
    } catch (error: unknown) {
      handleAnalysisError(error)
    } finally {
      submittingAnalysis.value = false
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
    currentAnalysis,
    loadingAnalysis,
    submittingAnalysis,
    hasError,
    errorTitle,
    errorText,
    onPageChange,
    searchAnalyses,
    clearSearch,
    refresh,
    openDeleteModal,
    closeDeleteModal,
    confirmDelete,
    loadAnalysis,
    saveAnalysis,
    resetError
  }
}
