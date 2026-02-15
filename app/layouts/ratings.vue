<template>
  <div class="min-h-screen flex flex-col px-2 pt-3 pb-5 md:items-center md:justify-center">
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
      class="inline-block w-auto max-w-screen-2xl overflow-x-auto mx-auto p-2 sm:p-6"
    >
      <slot />
    </UPageCard>
  </div>
</template>
