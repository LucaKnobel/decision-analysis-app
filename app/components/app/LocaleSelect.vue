<script setup lang="ts">
import { en, de } from '@nuxt/ui/locale'

const locales = [en, de]
const { locale, setLocale } = useI18n()

function handleLocaleChange(value: string) {
  setLocale(value as 'en' | 'de')
}
</script>

<template>
  <ULocaleSelect
    :model-value="locale"
    :locales="locales"
    @update:model-value="handleLocaleChange"
  />
</template>
