<script setup lang="ts">
definePageMeta({
  middleware: ['auth'],
  layout: 'focus'
})

const route = useRoute()
const analysisId = computed(() => route.params.id as string | undefined)

const {
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
} = useAlternatives(analysisId)

onMounted(loadAlternatives)
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
        {{ $t('alternatives.create.title') }}
      </h1>
      <p class="text-sm text-muted">
        {{ $t('alternatives.create.helper') }}
      </p>
    </div>

    <UFormField name="alternatives">
      <div class="space-y-4">
        <div
          v-for="(alternative, index) in state.alternatives"
          :key="index"
          class="rounded-lg border border-accented/60 bg-muted/30 p-4 space-y-3"
        >
          <p class="text-xs font-semibold uppercase tracking-wide text-muted">
            {{ $t('alternatives.itemLabel', { index: index + 1 }) }}
          </p>
          <div class="grid gap-4 md:grid-cols-[minmax(0,1fr)_auto] items-end">
            <UFormField
              :label="$t('alternatives.fields.name')"
              :name="`alternatives.${index}.name`"
            >
              <UInput
                v-model="alternative.name"
                class="w-full"
              />
            </UFormField>

            <UButton
              type="button"
              :label="$t('alternatives.actions.remove')"
              color="error"
              variant="outline"
              class="mb-1"
              :disabled="state.alternatives.length <= 1"
              @click="removeAlternative(index)"
            />
          </div>
        </div>

        <UButton
          type="button"
          :label="$t('alternatives.actions.add')"
          icon="i-lucide-plus"
          variant="subtle"
          @click="addAlternative"
        />
      </div>
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
      :disabled="isSubmitting || isLoading"
      :loading="isSubmitting || isLoading"
    />
  </UForm>
</template>
