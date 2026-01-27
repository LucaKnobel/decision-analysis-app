<script setup lang="ts">
definePageMeta({
  middleware: ['auth'],
  layout: 'dashboard'
})

const route = useRoute()
const { t } = useI18n()

// Get analysis ID from route
const analysisId = computed(() => route.params.id as string)

// TODO: Fetch analysis data from API
const _analysis = ref(null)
const isLoading = ref(true)

onMounted(async () => {
  // TODO: Implement API call to fetch analysis by ID
  isLoading.value = false
})
</script>

<template>
  <div class="max-w-7xl mx-auto">
    <UCard>
      <template #header>
        <div class="flex items-center justify-between">
          <div class="flex items-center gap-3">
            <UButton
              icon="i-lucide-arrow-left"
              variant="ghost"
              color="neutral"
              :to="localePath('/dashboard')"
              aria-label="Zurück zum Dashboard"
            />
            <div>
              <h1 class="text-2xl font-bold">
                {{ t('analysis.detail.title') }}
              </h1>
              <p class="text-sm text-muted">
                ID: {{ analysisId }}
              </p>
            </div>
          </div>
        </div>
      </template>

      <div
        v-if="isLoading"
        class="flex items-center justify-center py-12"
      >
        <UIcon
          name="i-lucide-loader-2"
          class="w-8 h-8 animate-spin text-primary"
        />
      </div>

      <div
        v-else
        class="space-y-6"
      >
        <!-- TODO: Analysis content will be implemented here -->
        <div class="text-center py-12 text-muted">
          <p>{{ t('analysis.detail.placeholder') }}</p>
        </div>
      </div>
    </UCard>
  </div>
</template>
