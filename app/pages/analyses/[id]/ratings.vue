<script setup lang="ts">
definePageMeta({
  middleware: ['auth'],
  layout: 'ratings'
})

const route = useRoute()
const analysisId = computed(() => route.params.id as string | undefined)

const {
  schema,
  state,
  alternatives,
  criteria,
  isSubmitting,
  isLoading,
  hasError,
  errorTitle,
  errorText,
  ratingAt,
  loadRatings,
  onSubmit
} = useRatings(analysisId)

onMounted(loadRatings)
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
        {{ $t('ratings.title') }}
      </h1>
      <p class="text-sm text-muted">
        {{ $t('ratings.helper') }}
      </p>
      <p class="text-sm text-muted">
        {{ $t('ratings.scale') }}
      </p>
    </div>

    <UFormField name="ratings">
      <div class="space-y-4 md:hidden">
        <div
          v-for="(alternative, alternativeIndex) in alternatives"
          :key="alternative.id"
          class="rounded-lg border border-accented/60 bg-muted/30 p-4 space-y-3"
        >
          <h2 class="text-sm font-semibold tracking-wide text-muted">
            {{ alternative.name }}
          </h2>
          <div class="space-y-3">
            <div
              v-for="(criterion, criterionIndex) in criteria"
              :key="criterion.id"
              class="flex items-center justify-between gap-3"
            >
              <span class="text-sm">
                {{ criterion.name }}
              </span>
              <UInput
                v-model.number="ratingAt(alternative.id, criterion.id, alternativeIndex, criterionIndex).value"
                type="number"
                min="1"
                max="5"
                class="w-20"
              />
            </div>
          </div>
        </div>
      </div>

      <div class="hidden md:block w-full min-w-0 overflow-x-auto">
        <div class="inline-block min-w-max align-top rounded-lg border border-accented/60">
          <table class="table-auto text-sm">
            <thead class="bg-muted/40">
              <tr>
                <th class="p-3 text-left font-semibold text-muted">
                  {{ $t('ratings.table.alternative') }}
                </th>
                <th
                  v-for="criterion in criteria"
                  :key="criterion.id"
                  class="p-3 text-left font-semibold text-muted"
                >
                  {{ criterion.name }}
                </th>
              </tr>
            </thead>
            <tbody>
              <tr
                v-for="(alternative, alternativeIndex) in alternatives"
                :key="alternative.id"
                class="border-t border-accented/60"
              >
                <td class="p-3 font-medium">
                  {{ alternative.name }}
                </td>
                <td
                  v-for="(criterion, criterionIndex) in criteria"
                  :key="criterion.id"
                  class="p-3"
                >
                  <UInput
                    v-model.number="ratingAt(alternative.id, criterion.id, alternativeIndex, criterionIndex).value"
                    type="number"
                    min="1"
                    max="5"
                    class="w-20"
                  />
                </td>
              </tr>
            </tbody>
          </table>
        </div>
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
