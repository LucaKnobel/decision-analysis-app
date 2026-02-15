<script setup lang="ts">
import type { FormSubmitEvent } from '@nuxt/ui'
import type { AnalysisForm } from '~/composables/useValidation'

definePageMeta({
  middleware: ['auth'],
  layout: 'focus'
})

const { createAnalysisFormSchema } = useValidation()
const { createAnalysis } = useAnalysisApi()
const { hasError, errorTitle, errorText, resetError, handleAnalysisError } = useErrorHandler()
const localePath = useLocalePath()
const { showSuccess } = useToastNotification()
const isSubmitting = ref(false)
const schema = createAnalysisFormSchema()

const state = reactive<Partial<AnalysisForm>>({
  title: undefined,
  description: undefined
})

const onSubmit = async (event: FormSubmitEvent<AnalysisForm>): Promise<void> => {
  if (isSubmitting.value) {
    return
  }
  resetError()
  isSubmitting.value = true

  try {
    const payload: CreateAnalysisBodyDTO = {
      title: event.data.title,
      description: event.data.description
    }
    const response = await createAnalysis(payload)
    showSuccess('analysis.create.successTitle', 'analysis.create.successMessage')
    await navigateTo(localePath(`/analyses/${response.id}/criteria`))
  } catch (error: unknown) {
    handleAnalysisError(error)
  } finally {
    isSubmitting.value = false
  }
}
</script>

<template>
  <div class="space-y-6">
    <h1 class="text-2xl font-bold">
      {{ $t('analysis.create.title') }}
    </h1>
    <UForm
      :schema="schema"
      :state="state"
      class="space-y-6"
      @submit="onSubmit"
    >
      <UFormField
        :label="$t('analysis.title')"
        name="title"
      >
        <UInput
          v-model="state.title"
          class="w-full"
        />
      </UFormField>

      <UFormField
        :label="$t('analysis.description')"
        name="description"
      >
        <UTextarea
          v-model="state.description"
          :rows="5"
          class="w-full"
        />
      </UFormField>
      <UAlert
        v-if="hasError"
        color="error"
        icon="i-lucide-alert-circle"
        :title="errorTitle"
        :description="errorText"
      />
      <UButton
        type="submit"
        :label="$t('analysis.create.title')"
      />
    </UForm>
  </div>
</template>
