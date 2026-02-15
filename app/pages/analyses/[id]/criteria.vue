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
} = useCriteria(analysisId)

onMounted(loadCriteria)
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
    <UFormField
      name="criteria"
      :ui="{ error: 'text-sm text-red-600 mt-2' }"
    >
      <div class="space-y-4">
        <div
          v-for="(criterion, index) in state.criteria"
          :key="index"
          class="rounded-lg border border-accented/60 bg-muted/30 p-4 space-y-3"
        >
          <p class="text-xs font-semibold tracking-wide text-muted">
            {{ $t('criteria.itemLabel', { index: index + 1 }) }}
          </p>
          <div class="grid gap-4 md:grid-cols-[minmax(0,1fr)_96px_auto] items-start">
            <UFormField
              :label="$t('criteria.fields.name')"
              :name="`criteria.${index}.name`"
              :ui="{ error: 'text-xs text-red-600 mt-1 min-h-[2.5rem]' }"
            >
              <UInput
                v-model="criterion.name"
                class="w-full"
              />
            </UFormField>

            <UFormField
              :label="$t('criteria.fields.weight')"
              :name="`criteria.${index}.weight`"
              :ui="{ error: 'text-xs text-red-600 mt-1 min-h-[2.5rem]' }"
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
              class="md:mt-6"
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
    </UFormField>

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
      :label="$t('common.continue')"
      :disabled="!isWeightValid || isSubmitting || isLoading"
      :loading="isSubmitting || isLoading"
    />
  </UForm>
</template>
