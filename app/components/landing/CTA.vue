<script setup lang="ts">
import type { ButtonProps } from '#ui/types'

const localePath = useLocalePath()
const { t } = useI18n()

const links: ButtonProps[] = [
  {
    label: t('pages.index.getStarted'),
    to: localePath('/auth/register')
  },
  {
    label: t('pages.index.learnMore'),
    to: localePath('/demo'),
    color: 'neutral',
    variant: 'outline',
    trailingIcon: 'i-lucide-arrow-right'
  }
]
</script>

<template>
  <div>
    <UPageHero
      :title="$t('pages.index.title')"
      :description="$t('pages.index.description')"
      :links="links"
    />
  </div>
</template>
