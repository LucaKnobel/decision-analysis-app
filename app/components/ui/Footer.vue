<script setup lang="ts">
import type { NavigationMenuItem } from '@nuxt/ui'

const route = useRoute()
const footerItems: NavigationMenuItem[] = [{
  label: $t('footer.privacy'),
  to: '/legal/privacy-policy',
  active: route.path.startsWith('/legal/privacy-policy')
},
{
  label: $t('footer.imprint'),
  to: '/legal/imprint',
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
  </UFooter>
</template>
