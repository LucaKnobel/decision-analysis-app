<script setup lang="ts">
import LocaleSelect from './LocaleSelect.vue'
import type { NavigationMenuItem } from '@nuxt/ui'

const route = useRoute()

const headerItems = computed<NavigationMenuItem[]>(() => [
  {
    label: $t('nav.register'),
    to: '/auth/register',
    active: route.path.startsWith('/auth/register')
  },
  {
    label: $t('nav.login'),
    to: '/auth/login',
    active: route.path.startsWith('/auth/login')
  },
  {
    label: $t('nav.demo'),
    to: '/demo',
    active: route.path.startsWith('/demo')
  }
])
</script>

<template>
  <UHeader
    title="Dezizio"
    mode="slideover"
  >
    <template #body>
      <UNavigationMenu
        :items="headerItems"
        orientation="vertical"
        class="-mx-2.5"
      />
      <LocaleSelect />
      <UColorModeSelect />
    </template>
  </UHeader>
</template>
