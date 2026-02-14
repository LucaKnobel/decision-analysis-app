<script setup lang="ts">
definePageMeta({
  middleware: ['auth'],
  layout: 'focus'
})
</script>

<template>
  <div class="space-y-2">
    <h1 class="text-2xl font-bold">
      {{ $t('results.title') }}
    </h1>
    <p class="text-sm text-muted">
      {{ $t('results.placeholder') }}
    </p>
  </div>
</template>
