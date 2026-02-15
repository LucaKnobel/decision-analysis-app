<script setup lang="ts">
import type { FormSubmitEvent } from '@nuxt/ui'
import type { AnalysisForm } from '~/composables/useValidation'

definePageMeta({
  middleware: ['auth'],
  layout: 'focus'
})

const route = useRoute()
const { createAnalysisFormSchema } = useValidation()
const {
  loadAnalysis,
  saveAnalysis,
  currentAnalysis,
  loadingAnalysis,
  submittingAnalysis,
  hasError,
  errorTitle,
  errorText
} = useAnalyses()
const localePath = useLocalePath()
const schema = createAnalysisFormSchema()

const analysisId = route.params.id as string

const state = reactive<Partial<AnalysisForm>>({
  title: undefined,
  description: undefined
})

onMounted(async () => {
  await loadAnalysis(analysisId)
  if (currentAnalysis.value) {
    state.title = currentAnalysis.value.title
    state.description = currentAnalysis.value.description || undefined
  }
})

const onSubmit = async (event: FormSubmitEvent<AnalysisForm>): Promise<void> => {
  if (submittingAnalysis.value) {
    return
  }
  const payload: CreateAnalysisBodyDTO = {
    title: event.data.title,
    description: event.data.description
  }
  await saveAnalysis(analysisId, payload)
  await navigateTo(localePath(`/analyses/${analysisId}/criteria`))
}
</script>

<template>
  <div class="space-y-6">
    <h1 class="text-2xl font-bold">
      {{ $t('analysis.edit.title') }}
    </h1>
    <div
      v-if="loadingAnalysis"
      class="flex items-center justify-center py-8"
    >
      <UIcon
        name="i-lucide-loader-2"
        class="animate-spin"
      />
    </div>
    <UForm
      v-if="!loadingAnalysis"
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
        :label="$t('common.continue')"
        :loading="submittingAnalysis"
      />
    </UForm>
  </div>
</template>
