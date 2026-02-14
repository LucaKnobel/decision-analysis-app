<template>
  <div class="min-h-screen flex flex-col px-4 pt-4 pb-6 md:items-center md:justify-center">
    <UButton
      icon="i-lucide-chevron-left"
      size="xl"
      color="neutral"
      variant="subtle"
      class="self-start mb-3 rounded-full md:absolute md:left-8 md:top-8 md:mb-0 md:z-10"
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
