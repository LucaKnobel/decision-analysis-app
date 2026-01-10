<script setup lang="ts">
import type { FormSubmitEvent, AuthFormField } from '@nuxt/ui'
import type { LoginForm } from '~/composables/useValidation'

definePageMeta({
  layout: 'auth'
})

const { createLoginFormSchema } = useValidation()
const { loginUser } = useAuthApi()
const { hasError, errorTitle, errorText, resetError, handleLoginError } = useErrorHandler()
const { t } = useI18n()
const toast = useToast()

const schema = createLoginFormSchema()
const isSubmitting = ref(false)

const fields: AuthFormField[] = [{
  name: 'email',
  type: 'email',
  label: t('pages.common.email'),
  placeholder: t('pages.common.placeHolderEmail'),
  required: true
}, {
  name: 'password',
  label: t('pages.common.password'),
  type: 'password',
  placeholder: t('pages.common.placeHolderPassword'),
  required: true
}]

const handleSuccess = async (): Promise<void> => {
  toast.add({
    title: t('pages.login.successMessageTitle'),
    description: t('pages.login.successMessage'),
    color: 'success'
  })
  await navigateTo('/dashboard')
}

const onSubmit = async (event: FormSubmitEvent<LoginForm>): Promise<void> => {
  if (isSubmitting.value) {
    return
  }
  resetError()
  isSubmitting.value = true

  try {
    const payload: LoginUserRequestDTO = {
      email: event.data.email,
      password: event.data.password
    }
    await loginUser(payload)
    await handleSuccess()
  } catch (error: unknown) {
    handleLoginError(error)
  } finally {
    isSubmitting.value = false
  }
}
</script>

<template>
  <UAuthForm
    :schema="schema"
    :fields="fields"
    :title="$t('pages.login.title')"
    :submit="{
      label: $t('pages.login.loginAccount'),
      color: 'primary',
      loading: isSubmitting
    }"
    @submit="onSubmit"
  >
    <template #description>
      {{ $t('pages.login.dontHaveAccount') }} <NuxtLinkLocale
        to="/auth/register"
        class="text-primary font-medium"
      >
        {{ $t('nav.register') }}
      </NuxtLinkLocale>
    </template>
    <template #password-hint>
      <NuxtLinkLocale
        to="/auth/forgot-password"
        class="text-primary font-medium"
      >
        {{ $t('pages.login.forgotPassword') }}
      </NuxtLinkLocale>
    </template>
    <template #validation>
      <UAlert
        v-if="hasError"
        color="error"
        icon="i-lucide-alert-circle"
        :title="errorTitle"
        :description="errorText"
      />
    </template>
    <template #footer>
      {{ $t('pages.login.termsHint') }}
      <USeparator class="my-2" />
      <NuxtLinkLocale
        to="/legal/terms-of-service"
        class="text-primary font-medium"
      >
        {{ $t('legal.termsOfService') }}
      </NuxtLinkLocale>
    </template>
  </UAuthForm>
</template>
