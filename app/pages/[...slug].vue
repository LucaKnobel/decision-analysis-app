<script setup lang="ts">
import { withLeadingSlash } from 'ufo'

const route = useRoute()
const { locale } = useI18n()

const slug = computed(() => {
  const value = Array.isArray(route.params.slug)
    ? route.params.slug.join('/')
    : String(route.params.slug || '')

  return withLeadingSlash(String(value))
})

const contentPath = computed(() => `/api/content${slug.value}`)

const { data: page } = await useAsyncData(
  () => `page-${locale.value}-${slug.value}`,
  async () => {
    try {
      return await $fetch(contentPath.value, {
        params: { locale: locale.value }
      })
    } catch {
      return null
    }
  },
  { watch: [locale, slug] }
)
</script>

<template>
  <UContainer class="py-10">
    <div
      v-if="page"
      class="prose prose-neutral max-w-none"
    >
      <ContentRenderer :value="page" />
    </div>
    <div v-else>
      <h1 class="text-2xl font-semibold tracking-tight">
        {{ $t('content.notFound.title') }}
      </h1>
      <p class="text-muted mt-2">
        {{ $t('content.notFound.text', { locale }) }}
      </p>
    </div>
  </UContainer>
</template>
