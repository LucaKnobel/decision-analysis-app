<script setup lang="ts">
definePageMeta({
  middleware: ['auth'],
  layout: 'dashboard'
})

const localePath = useLocalePath()
</script>

<template>
  <UButton
    :label="$t('analysis.create.title')"
    :to="localePath('/analyses/create')"
    icon="i-lucide-plus"
    size="md"
    color="primary"
    variant="solid"
  />
</template>
