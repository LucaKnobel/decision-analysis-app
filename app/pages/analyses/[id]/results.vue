<script setup lang="ts">
definePageMeta({
  middleware: ['auth'],
  layout: 'focus'
})

const route = useRoute()
const localePath = useLocalePath()
const analysisId = computed(() => route.params.id as string | undefined)
const showDashboardButton = computed(() => route.query.from === 'flow')

const {
  results,
  criteria,
  weightSum,
  isLoading,
  hasError,
  errorTitle,
  errorText,
  loadResults
} = useResults(analysisId)

const topResult = computed(() => results.value[0])
const criteriaById = computed(() => new Map(criteria.value.map(criterion => [criterion.id, criterion])))
const maxScore = computed(() => (weightSum.value > 0 ? 5 : 0))

const formatScore = (score: number) => score.toFixed(2)
const formatPercent = (value: number) => `${(value * 100).toFixed(1)}%`
const criterionName = (criterionId: string) => criteriaById.value.get(criterionId)?.name ?? ''

onMounted(loadResults)
</script>

<template>
  <div class="space-y-6">
    <div class="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
      <div class="space-y-2">
        <h1 class="text-2xl font-bold">
          {{ $t('results.title') }}
        </h1>
        <p class="text-sm text-muted">
          {{ $t('results.subtitle') }}
        </p>
        <p class="text-xs text-muted">
          {{ $t('results.weightSum', { sum: weightSum }) }}
        </p>
      </div>
      <UButton
        v-if="showDashboardButton"
        :label="$t('results.backToDashboard')"
        :to="localePath('/dashboard')"
        icon="i-lucide-layout-dashboard"
        color="neutral"
        variant="soft"
      />
    </div>

    <UAlert
      v-if="hasError"
      color="error"
      icon="i-lucide-alert-circle"
      :title="errorTitle"
      :description="errorText"
    />

    <div
      v-else-if="isLoading"
      class="text-sm text-muted"
    >
      {{ $t('common.loading') }}
    </div>

    <div
      v-else-if="results.length === 0"
      class="text-sm text-muted"
    >
      {{ $t('results.empty') }}
    </div>

    <div
      v-else
      class="space-y-6"
    >
      <div class="rounded-lg border border-primary/60 bg-primary/10 p-4 shadow-sm">
        <p class="text-xs font-semibold uppercase tracking-wide text-muted">
          {{ $t('results.bestLabel') }}
        </p>
        <div class="flex items-baseline justify-between gap-4">
          <h2 class="text-lg font-semibold">
            {{ topResult?.alternativeName }}
          </h2>
          <div class="text-2xl font-bold">
            {{ formatScore(topResult?.totalScore ?? 0) }} / {{ formatScore(maxScore) }}
          </div>
        </div>
        <p class="text-xs text-muted">
          {{ $t('results.scoreLabel') }} · {{ $t('results.maxScoreLabel') }}
        </p>
      </div>

      <div class="space-y-2">
        <h2 class="text-lg font-semibold">
          {{ $t('results.rankingTitle') }}
        </h2>
        <div class="md:hidden space-y-2">
          <div
            v-for="result in results"
            :key="result.alternativeId"
            class="rounded-lg border border-accented/60 p-3"
          >
            <div class="flex items-center justify-between gap-3">
              <div class="text-sm font-semibold">
                {{ result.rank }} · {{ result.alternativeName }}
              </div>
              <div class="text-sm font-semibold">
                {{ formatScore(result.totalScore) }} / {{ formatScore(maxScore) }}
              </div>
            </div>
          </div>
        </div>
        <div class="hidden md:block rounded-lg border border-accented/60 overflow-x-auto">
          <table class="min-w-full text-sm">
            <thead class="bg-muted/40">
              <tr>
                <th class="p-3 text-left font-semibold text-muted">
                  {{ $t('results.columns.rank') }}
                </th>
                <th class="p-3 text-left font-semibold text-muted">
                  {{ $t('results.columns.alternative') }}
                </th>
                <th class="p-3 text-right font-semibold text-muted">
                  {{ $t('results.columns.score') }}
                </th>
              </tr>
            </thead>
            <tbody>
              <tr
                v-for="result in results"
                :key="result.alternativeId"
                class="border-t border-accented/60"
              >
                <td class="p-3 font-medium">
                  {{ result.rank }}
                </td>
                <td class="p-3">
                  {{ result.alternativeName }}
                </td>
                <td class="p-3 text-right font-semibold">
                  {{ formatScore(result.totalScore) }} / {{ formatScore(maxScore) }}
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <div class="space-y-4">
        <h2 class="text-lg font-semibold">
          {{ $t('results.breakdownTitle') }}
        </h2>

        <div
          v-for="result in results"
          :key="result.alternativeId"
          class="rounded-lg border border-accented/60 p-4 space-y-3"
        >
          <div class="flex items-baseline justify-between gap-4">
            <div class="text-base font-semibold">
              {{ result.alternativeName }}
            </div>
            <div class="text-lg font-semibold">
              {{ formatScore(result.totalScore) }} / {{ formatScore(maxScore) }}
            </div>
          </div>

          <div class="md:hidden space-y-2">
            <div
              v-for="contribution in result.contributions"
              :key="contribution.criterionId"
              class="rounded-lg border border-accented/40 p-3"
            >
              <div class="text-sm font-semibold">
                {{ criterionName(contribution.criterionId) }}
              </div>
              <div class="mt-2 grid grid-cols-2 gap-2 text-xs text-muted">
                <div>{{ $t('results.columns.weight') }}: {{ contribution.weight }}</div>
                <div>{{ $t('results.columns.normalizedWeight') }}: {{ formatPercent(contribution.normalizedWeight) }}</div>
                <div>{{ $t('results.columns.rating') }}: {{ contribution.rating }}</div>
                <div>{{ $t('results.columns.contribution') }}: {{ formatScore(contribution.weightedScore) }}</div>
              </div>
            </div>
          </div>
          <div class="hidden md:block overflow-x-auto">
            <table class="min-w-full text-sm">
              <thead class="bg-muted/30">
                <tr>
                  <th class="p-2 text-left font-semibold text-muted">
                    {{ $t('results.columns.criterion') }}
                  </th>
                  <th class="p-2 text-right font-semibold text-muted">
                    {{ $t('results.columns.weight') }}
                  </th>
                  <th class="p-2 text-right font-semibold text-muted">
                    {{ $t('results.columns.normalizedWeight') }}
                  </th>
                  <th class="p-2 text-right font-semibold text-muted">
                    {{ $t('results.columns.rating') }}
                  </th>
                  <th class="p-2 text-right font-semibold text-muted">
                    {{ $t('results.columns.contribution') }}
                  </th>
                </tr>
              </thead>
              <tbody>
                <tr
                  v-for="contribution in result.contributions"
                  :key="contribution.criterionId"
                  class="border-t border-accented/40"
                >
                  <td class="p-2">
                    {{ criterionName(contribution.criterionId) }}
                  </td>
                  <td class="p-2 text-right">
                    {{ contribution.weight }}
                  </td>
                  <td class="p-2 text-right">
                    {{ formatPercent(contribution.normalizedWeight) }}
                  </td>
                  <td class="p-2 text-right">
                    {{ contribution.rating }}
                  </td>
                  <td class="p-2 text-right font-semibold">
                    {{ formatScore(contribution.weightedScore) }}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
