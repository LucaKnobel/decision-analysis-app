<script setup lang="ts">
const localePath = useLocalePath()
const { clear: clearSession } = useUserSession()

async function logout() {
  await clearSession()
  await navigateTo(localePath('/'))
}
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
