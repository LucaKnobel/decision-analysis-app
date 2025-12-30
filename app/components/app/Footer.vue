<script setup lang="ts">
const localePath = useLocalePath()

const route = useRoute()
const footerItems = computed(() => [{
  label: $t('legal.privacyPolicy'),
  to: localePath('/legal/privacy-policy'),
  active: route.path.startsWith('/legal/privacy-policy')
},
{
  label: $t('legal.imprint'),
  to: localePath('/legal/imprint'),
  active: route.path.startsWith('/legal/imprint')
},
{
  label: $t('legal.termsOfService'),
  to: localePath('/legal/terms-of-service'),
  active: route.path.startsWith('/legal/terms-of-service')
}])
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
