<template>
  <div>
    <p>{{ $t('pages.index.title') }}</p>
    <slot />
  </div>
  <UFooter>
    <template #left>
      <p class="text-muted text-sm">
        {{ $t('footer.copyright') }} {{ new Date().getFullYear() }}
      </p>
    </template>
    <template #right>
      <NuxtLink :to="$localePath('demo')">{{ $t('nav.demo') }}</NuxtLink>
      <NuxtLink :to="$localePath('privacy-policy')">{{ $t('footer.privacy') }}</NuxtLink>
      <NuxtLink :to="$localePath('imprint')">{{ $t('footer.imprint') }}</NuxtLink>
    </template>
  </UFooter>
</template>
