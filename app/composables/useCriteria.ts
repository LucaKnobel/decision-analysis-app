import { computed, reactive, ref } from 'vue'
import { useLocalePath, navigateTo } from '#imports'
import { useValidation } from './useValidation'
import { useErrorHandler } from './useErrorHandler'
import { useToastNotification } from './useToastNotification'
import { useAnalysisApi } from './useAnalysisApi'
import type { FormSubmitEvent } from '@nuxt/ui'
import type { CriteriaForm } from '~/composables/useValidation'
import type { CriterionItemDTO, UpdateCriteriaBodyDTO } from '#shared/types/criterion'
import type { ComputedRef, Ref } from 'vue'

export interface UseCriteriaComposable {
  schema: ReturnType<ReturnType<typeof useValidation>['createCriteriaFormSchema']>
  state: CriteriaForm
  totalWeight: ComputedRef<number>
  isWeightValid: ComputedRef<boolean>
  isSubmitting: Ref<boolean>
  isLoading: Ref<boolean>
  hasError: Ref<boolean>
  errorTitle: Ref<string | undefined>
  errorText: Ref<string | undefined>
  addCriterion: () => void
  removeCriterion: (index: number) => void
  loadCriteria: () => Promise<void>
  onSubmit: (event: FormSubmitEvent<CriteriaForm>) => Promise<void>
}

export const useCriteria = (analysisId: Ref<string | undefined>): UseCriteriaComposable => {
  const { createCriteriaFormSchema } = useValidation()
  const { getCriteria, updateCriteria } = useAnalysisApi()
  const { hasError, errorTitle, errorText, resetError, handleCriteriaError } = useErrorHandler()
  const localePath = useLocalePath()
  const { showSuccess } = useToastNotification()

  const isSubmitting = ref(false)
  const isLoading = ref(false)
  const schema = createCriteriaFormSchema()

  const state = reactive<CriteriaForm>({
    criteria: [
      {
        name: '',
        weight: 0
      }
    ]
  })

  const totalWeight = computed(() => {
    return state.criteria.reduce((sum, criterion) => sum + (Number(criterion.weight) || 0), 0)
  })

  const isWeightValid = computed(() => totalWeight.value === 100)

  const addCriterion = () => {
    state.criteria.push({ name: '', weight: 0 })
  }

  const removeCriterion = (index: number) => {
    if (state.criteria.length <= 1) {
      return
    }
    state.criteria.splice(index, 1)
  }

  const applyCriteria = (criteria: CriterionItemDTO[]) => {
    if (criteria.length === 0) {
      return
    }
    state.criteria = criteria.map(criterion => ({
      id: criterion.id,
      name: criterion.name,
      weight: criterion.weight
    }))
  }

  const loadCriteria = async () => {
    const id = analysisId.value
    if (!id) {
      return
    }
    isLoading.value = true
    try {
      const response = await getCriteria(id)
      applyCriteria(response.data)
    } catch (error: unknown) {
      handleCriteriaError(error)
    } finally {
      isLoading.value = false
    }
  }

  const onSubmit = async (event: FormSubmitEvent<CriteriaForm>): Promise<void> => {
    if (isSubmitting.value) {
      return
    }
    resetError()
    isSubmitting.value = true

    try {
      const id = analysisId.value
      if (!id) {
        throw new Error('Missing analysis id')
      }

      const payload: UpdateCriteriaBodyDTO = {
        criteria: event.data.criteria
      }
      await updateCriteria(id, payload)
      showSuccess('criteria.create.successTitle', 'criteria.create.successMessage')
      await navigateTo(localePath(`/analyses/${id}/alternatives`))
    } catch (error: unknown) {
      handleCriteriaError(error)
    } finally {
      isSubmitting.value = false
    }
  }

  return {
    schema,
    state,
    totalWeight,
    isWeightValid,
    isSubmitting,
    isLoading,
    hasError,
    errorTitle,
    errorText,
    addCriterion,
    removeCriterion,
    loadCriteria,
    onSubmit
  }
}
