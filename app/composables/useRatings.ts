import { reactive, ref } from 'vue'
import { useLocalePath, navigateTo } from '#imports'
import { useValidation } from './useValidation'
import { useErrorHandler } from './useErrorHandler'
import { useAnalysisApi } from './useAnalysisApi'
import type { FormSubmitEvent } from '@nuxt/ui'
import type { RatingsForm } from '~/composables/useValidation'
import type { AlternativeItemDTO } from '#shared/types/alternative'
import type { CriterionItemDTO } from '#shared/types/criterion'
import type { RatingItemDTO, UpdateRatingsBodyDTO } from '#shared/types/rating'
import type { Ref } from 'vue'

export interface UseRatingsComposable {
  schema: ReturnType<ReturnType<typeof useValidation>['createRatingsFormSchema']>
  state: RatingsForm
  alternatives: Ref<AlternativeItemDTO[]>
  criteria: Ref<CriterionItemDTO[]>
  isSubmitting: Ref<boolean>
  isLoading: Ref<boolean>
  hasError: Ref<boolean>
  errorTitle: Ref<string | undefined>
  errorText: Ref<string | undefined>
  ratingIndex: (alternativeIndex: number, criterionIndex: number) => number
  ratingAt: (
    alternativeId: string,
    criterionId: string,
    alternativeIndex: number,
    criterionIndex: number
  ) => RatingItemDTO
  loadRatings: () => Promise<void>
  onSubmit: (event: FormSubmitEvent<RatingsForm>) => Promise<void>
}

const DEFAULT_RATING = 3

export const useRatings = (analysisId: Ref<string | undefined>): UseRatingsComposable => {
  const { createRatingsFormSchema } = useValidation()
  const { getRatings, updateRatings } = useAnalysisApi()
  const { hasError, errorTitle, errorText, resetError, handleRatingsError } = useErrorHandler()
  const localePath = useLocalePath()

  const isSubmitting = ref(false)
  const isLoading = ref(false)
  const schema = createRatingsFormSchema()

  const alternatives = ref<AlternativeItemDTO[]>([])
  const criteria = ref<CriterionItemDTO[]>([])

  const state = reactive<RatingsForm>({
    ratings: []
  })

  const ratingIndex = (alternativeIndex: number, criterionIndex: number) => {
    return alternativeIndex * criteria.value.length + criterionIndex
  }

  const ratingAt = (
    alternativeId: string,
    criterionId: string,
    alternativeIndex: number,
    criterionIndex: number
  ): RatingItemDTO => {
    const index = ratingIndex(alternativeIndex, criterionIndex)
    const existing = state.ratings[index]

    if (existing && existing.alternativeId === alternativeId && existing.criterionId === criterionId) {
      return existing
    }

    const rating: RatingItemDTO = {
      alternativeId,
      criterionId,
      value: DEFAULT_RATING
    }
    state.ratings[index] = rating
    return rating
  }

  const buildRatings = (
    alternativesList: AlternativeItemDTO[],
    criteriaList: CriterionItemDTO[],
    existingRatings: RatingItemDTO[]
  ): UpdateRatingsBodyDTO['ratings'] => {
    const ratingMap = new Map<string, number>(
      existingRatings.map(rating => [
        `${rating.alternativeId}:${rating.criterionId}`,
        rating.value
      ])
    )

    return alternativesList.flatMap(alternative =>
      criteriaList.map(criterion => ({
        alternativeId: alternative.id,
        criterionId: criterion.id,
        value: ratingMap.get(`${alternative.id}:${criterion.id}`) ?? DEFAULT_RATING
      }))
    )
  }

  const loadRatings = async () => {
    const id = analysisId.value
    if (!id) {
      return
    }
    resetError()
    isLoading.value = true
    try {
      const response = await getRatings(id)
      alternatives.value = response.alternatives
      criteria.value = response.criteria
      state.ratings = buildRatings(response.alternatives, response.criteria, response.ratings)
    } catch (error: unknown) {
      handleRatingsError(error)
    } finally {
      isLoading.value = false
    }
  }

  const onSubmit = async (event: FormSubmitEvent<RatingsForm>): Promise<void> => {
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

      const payload: UpdateRatingsBodyDTO = {
        ratings: event.data.ratings
      }
      await updateRatings(id, payload)
      await navigateTo(localePath(`/analyses/${id}/results`))
    } catch (error: unknown) {
      handleRatingsError(error)
    } finally {
      isSubmitting.value = false
    }
  }

  return {
    schema,
    state,
    alternatives,
    criteria,
    isSubmitting,
    isLoading,
    hasError,
    errorTitle,
    errorText,
    ratingIndex,
    ratingAt,
    loadRatings,
    onSubmit
  }
}
