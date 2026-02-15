<template>
  <div class="min-h-screen grid place-items-center px-4 py-6">
    <UButton
      icon="i-lucide-chevron-left"
      to="/"
      size="xl"
      color="neutral"
      variant="subtle"
      class="fixed left-4 top-4 z-50 rounded-full md:left-8 md:top-8"
    />

    <UPageCard
      variant="subtle"
      class="max-w-sm w-full"
    >
      <slot />
    </UPageCard>
  </div>
</template>
