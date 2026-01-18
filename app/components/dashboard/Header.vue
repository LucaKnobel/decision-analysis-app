<!-- <script setup lang="ts">
const localePath = useLocalePath()
</script> -->

<template>
  <UHeader>
    <template #left>
      <AppLogo />
    </template>
    <template #right>
      <UColorModeButton />
      <div class="hidden lg:flex items-center gap-2">
        <AppLocaleSelect />
        <AppLogoutButton />
      </div>
    </template>
    <template #body>
      <div class="flex flex-col gap-2 p-4 items-center w-full">
        <AppLogoutButton />
        <AppLocaleSelect />
      </div>
    </template>
  </UHeader>
</template>
