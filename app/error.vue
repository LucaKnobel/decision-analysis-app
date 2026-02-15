<script setup lang="ts">
import type { NuxtError } from '#app'

const props = defineProps<{ error: NuxtError }>()

const localePath = useLocalePath()

const getErrorKey = () => {
  const status = props.error.status

  if (status === 404) {
    return '404'
  }
  if (status && status >= 500) {
    return '500'
  }
  return 'default'
}

const errorKey = getErrorKey()

const handleError = async () => {
  clearError()
  await navigateTo(localePath('/'))
}
</script>

<template>
  <div class="min-h-screen flex items-center justify-center px-4">
    <div class="max-w-md w-full text-center space-y-6">
      <div class="space-y-2">
        <h1 class="text-4xl font-bold text-gray-900 dark:text-white">
          {{ $t(`errors.page.${errorKey}.title`) }}
        </h1>
        <p class="text-gray-600 dark:text-gray-400">
          {{ $t(`errors.page.${errorKey}.description`) }}
        </p>
      </div>
      <UButton
        :label="$t('common.backToHome')"
        icon="i-lucide-home"
        size="lg"
        color="primary"
        @click="handleError"
      />
    </div>
  </div>
</template>
