import { reactive, ref } from 'vue'
import { useLocalePath, navigateTo } from '#imports'
import { useValidation } from './useValidation'
import { useErrorHandler } from './useErrorHandler'
import { useAnalysisApi } from './useAnalysisApi'
import type { FormSubmitEvent } from '@nuxt/ui'
import type { AlternativesForm } from '~/composables/useValidation'
import type { AlternativeItemDTO, UpdateAlternativesBodyDTO } from '#shared/types/alternative'
import type { Ref } from 'vue'

export interface UseAlternativesComposable {
  schema: ReturnType<ReturnType<typeof useValidation>['createAlternativesFormSchema']>
  state: AlternativesForm
  isSubmitting: Ref<boolean>
  isLoading: Ref<boolean>
  hasError: Ref<boolean>
  errorTitle: Ref<string | undefined>
  errorText: Ref<string | undefined>
  addAlternative: () => void
  removeAlternative: (index: number) => void
  loadAlternatives: () => Promise<void>
  onSubmit: (event: FormSubmitEvent<AlternativesForm>) => Promise<void>
}

export const useAlternatives = (analysisId: Ref<string | undefined>): UseAlternativesComposable => {
  const { createAlternativesFormSchema } = useValidation()
  const { getAlternatives, updateAlternatives } = useAnalysisApi()
  const { hasError, errorTitle, errorText, resetError, handleAlternativesError } = useErrorHandler()
  const localePath = useLocalePath()

  const isSubmitting = ref(false)
  const isLoading = ref(false)
  const schema = createAlternativesFormSchema()

  const state = reactive<AlternativesForm>({
    alternatives: [
      {
        name: ''
      }
    ]
  })

  const addAlternative = () => {
    state.alternatives.push({ name: '' })
  }

  const removeAlternative = (index: number) => {
    if (state.alternatives.length <= 1) {
      return
    }
    state.alternatives.splice(index, 1)
  }

  const applyAlternatives = (alternatives: AlternativeItemDTO[]) => {
    if (alternatives.length === 0) {
      return
    }
    state.alternatives = alternatives.map(alternative => ({
      id: alternative.id,
      name: alternative.name
    }))
  }

  const loadAlternatives = async () => {
    const id = analysisId.value
    if (!id) {
      return
    }
    isLoading.value = true
    try {
      const response = await getAlternatives(id)
      applyAlternatives(response.data)
    } catch (error: unknown) {
      handleAlternativesError(error)
    } finally {
      isLoading.value = false
    }
  }

  const onSubmit = async (event: FormSubmitEvent<AlternativesForm>): Promise<void> => {
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

      const payload: UpdateAlternativesBodyDTO = {
        alternatives: event.data.alternatives
      }
      await updateAlternatives(id, payload)
      await navigateTo(localePath(`/analyses/${id}/ratings`))
    } catch (error: unknown) {
      handleAlternativesError(error)
    } finally {
      isSubmitting.value = false
    }
  }

  return {
    schema,
    state,
    isSubmitting,
    isLoading,
    hasError,
    errorTitle,
    errorText,
    addAlternative,
    removeAlternative,
    loadAlternatives,
    onSubmit
  }
}
