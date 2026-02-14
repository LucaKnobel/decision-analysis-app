<script setup lang="ts">
definePageMeta({
  middleware: ['auth'],
  layout: 'focus'
})

const route = useRoute()
const analysisId = computed(() => route.params.id as string | undefined)
</script>

<template>
  <div class="space-y-2">
    <h1>{{ analysisId }}</h1>
    <h1 class="text-2xl font-bold">
      {{ $t('ratings.title') }}
    </h1>
    <p class="text-sm text-muted">
      {{ $t('ratings.placeholder') }}
    </p>
  </div>
</template>
