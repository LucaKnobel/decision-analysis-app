<script setup lang="ts">
import type { FormSubmitEvent } from '@nuxt/ui'
import type { CriteriaForm } from '~/composables/useValidation'

definePageMeta({
  middleware: ['auth'],
  layout: 'focus'
})

const route = useRoute()
const analysisId = computed(() => route.params.id as string | undefined)

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

onMounted(loadCriteria)

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
</script>

<template>
  <UForm
    :schema="schema"
    :state="state"
    class="space-y-6"
    @submit="onSubmit"
  >
    <div class="space-y-2">
      <h1 class="text-2xl font-bold">
        {{ $t('criteria.create.title') }}
      </h1>
      <p class="text-sm text-muted">
        {{ $t('criteria.create.helper') }}
      </p>
      <p class="text-sm font-medium">
        {{ $t('criteria.total') }}: {{ totalWeight }}/100
      </p>
    </div>
    <div class="space-y-4">
      <div
        v-for="(criterion, index) in state.criteria"
        :key="index"
        class="rounded-lg border border-accented/60 bg-muted/30 p-4 space-y-3"
      >
        <p class="text-xs font-semibold uppercase tracking-wide text-muted">
          {{ $t('criteria.itemLabel', { index: index + 1 }) }}
        </p>
        <div class="grid gap-4 md:grid-cols-[minmax(0,1fr)_96px_auto] items-end">
          <UFormField
            :label="$t('criteria.fields.name')"
            :name="`criteria.${index}.name`"
          >
            <UInput
              v-model="criterion.name"
              class="w-full"
            />
          </UFormField>

          <UFormField
            :label="$t('criteria.fields.weight')"
            :name="`criteria.${index}.weight`"
          >
            <UInput
              v-model.number="criterion.weight"
              type="number"
              min="0"
              max="100"
              class="w-full"
            />
          </UFormField>

          <UButton
            type="button"
            :label="$t('criteria.actions.remove')"
            color="error"
            variant="outline"
            class="mb-1"
            :disabled="state.criteria.length <= 1"
            @click="removeCriterion(index)"
          />
        </div>
      </div>

      <UButton
        type="button"
        :label="$t('criteria.actions.add')"
        icon="i-lucide-plus"
        variant="subtle"
        @click="addCriterion"
      />
    </div>

    <UAlert
      v-if="hasError"
      color="error"
      icon="i-lucide-alert-circle"
      :title="errorTitle"
      :description="errorText"
    />

    <UAlert
      v-if="!isWeightValid"
      color="warning"
      icon="i-lucide-info"
      :title="$t('validation.criteria.weight.sum')"
    />

    <UButton
      type="submit"
      :label="$t('criteria.create.submit')"
      :disabled="!isWeightValid || isSubmitting || isLoading"
      :loading="isSubmitting || isLoading"
    />
  </UForm>
</template>
