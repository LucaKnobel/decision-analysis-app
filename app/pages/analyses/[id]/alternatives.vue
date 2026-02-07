<script setup lang="ts">
definePageMeta({
  middleware: ['auth'],
  layout: 'focus'
})

const route = useRoute()
const analysisId = computed(() => route.params.id as string | undefined)
</script>

<template>
  <div>{{ analysisId }}</div>
</template>
