<script setup lang="ts">
import type { NavigationMenuItem } from '@nuxt/ui'

const localePath = useLocalePath()

const route = useRoute()
const footerItems: NavigationMenuItem[] = [{
  label: $t('footer.privacy'),
  to: localePath('/legal/privacy-policy'),
  active: route.path.startsWith('/legal/privacy-policy')
},
{
  label: $t('footer.imprint'),
  to: localePath('/legal/imprint'),
  active: route.path.startsWith('/legal/imprint')
}]
</script>

<template>
  <USeparator />
  <UFooter>
    <template #left>
      <p class="text-muted text-sm">
        {{ $t('footer.copyright') }} {{ new Date().getFullYear() }}
      </p>
    </template>
    <UNavigationMenu :items="footerItems" />
    <template #right>
      <AppLocaleSelect />
    </template>
  </UFooter>
</template>
