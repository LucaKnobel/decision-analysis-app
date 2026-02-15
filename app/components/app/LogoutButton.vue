<script setup lang="ts">
const { logout } = useAccountActions()
</script>

<template>
  <UButton
    :label="$t('nav.logout')"
    icon="i-lucide-log-out"
    size="md"
    color="neutral"
    variant="ghost"
    @click="logout"
  />
</template>
