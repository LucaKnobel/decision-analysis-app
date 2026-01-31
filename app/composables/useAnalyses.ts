export const useAnalyses = () => {
  const page = ref(1)
  const limit = ref(10)
  const activeSearch = ref('')
  const searchInput = ref('')

  const { fetchAnalyses } = useAnalysisApi()

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
    onPageChange,
    searchAnalyses,
    clearSearch,
    refresh
  }
}
