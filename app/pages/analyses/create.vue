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
const { t } = useI18n()
const localePath = useLocalePath()
const toast = useToast()

const isSubmitting = ref(false)
const schema = createAnalysisFormSchema()

const state = reactive<Partial<AnalysisForm>>({
  title: undefined,
  description: undefined
})

/* toast success function auslagern */
const handleSuccess = async (): Promise<void> => {
  toast.add({
    title: t('analysis.create.successTitle'),
    description: t('analysis.create.successMessage'),
    color: 'success'
  })
  await navigateTo(localePath('/dashboard'))
}

const onSubmit = async (event: FormSubmitEvent<AnalysisForm>): Promise<void> => {
  if (isSubmitting.value) {
    return
  }
  resetError()
  isSubmitting.value = true

  try {
    const payload: CreateAnalysisRequestDTO = {
      title: event.data.title,
      description: event.data.description
    }
    await createAnalysis(payload)
    await handleSuccess()
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
