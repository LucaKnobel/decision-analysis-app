<template>
  <div class="h-screen flex items-center justify-center px-4">
    <UButton
      icon="i-lucide-chevron-left"
      size="xl"
      color="neutral"
      variant="subtle"
      class="absolute left-8 top-8 rounded-full z-10"
      @click="$router.back()"
    />

    <UPageCard
      variant="subtle"
      class="w-full max-w-2xl"
    >
      <slot />
    </UPageCard>
  </div>
</template>
