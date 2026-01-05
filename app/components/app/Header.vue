<script setup lang="ts">
const localePath = useLocalePath()
</script>

<template>
  <UHeader>
    <template #left>
      <AppLogo />
    </template>

    <template #right>
      <UColorModeButton />

      <UButton
        icon="i-lucide-log-in"
        color="neutral"
        variant="ghost"
        :to="localePath('/auth/login')"
        class="lg:hidden"
      />

      <UButton
        :label="$t('nav.login')"
        color="neutral"
        variant="outline"
        :to="localePath('/auth/login')"
        class="hidden lg:inline-flex"
      />

      <UButton
        :label="$t('nav.register')"
        color="neutral"
        trailing-icon="i-lucide-arrow-right"
        class="hidden lg:inline-flex"
        :to="localePath('/auth/register')"
      />
    </template>

    <template #body>
      <UButton
        :label="$t('nav.login')"
        color="neutral"
        variant="subtle"
        :to="localePath('/auth/login')"
        block
        class="mb-3"
      />
      <UButton
        :label="$t('nav.register')"
        color="neutral"
        :to="localePath('/auth/register')"
        block
      />
    </template>
  </UHeader>
</template>
