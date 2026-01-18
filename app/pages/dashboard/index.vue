<script setup lang="ts">
definePageMeta({
  middleware: ['auth'],
  layout: 'dashboard'
})
</script>

<template>
  <div>
    <p>Dashboard Index</p>
  </div>
  <NuxtLinkLocale to="/dashboard/test">
    Go to Dashboard Test
  </NuxtLinkLocale>
</template>
