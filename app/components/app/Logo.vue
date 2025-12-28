<script setup lang="ts">
defineProps<{
  size?: 'sm' | 'md' | 'lg'
}>()
</script>

<template>
  <NuxtLinkLocale
    to="/"
    :class="[
      'font-bold tracking-tight transition-opacity hover:opacity-80',
      size === 'sm' && 'text-xl',
      size === 'lg' && 'text-4xl',
      !size && 'text-2xl'
    ]"
  >
    <span class="text-foreground">Dezi</span><span class="text-primary">zio</span>
  </NuxtLinkLocale>
</template>
