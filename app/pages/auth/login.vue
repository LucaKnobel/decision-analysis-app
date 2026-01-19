<script setup lang="ts">
import type { FormSubmitEvent, AuthFormField } from '@nuxt/ui'
import type { LoginForm } from '~/composables/useValidation'

definePageMeta({
  layout: 'auth'
})

const { fetch: refreshSession } = useUserSession()
const { createLoginFormSchema } = useValidation()
const { loginUser } = useAuthApi()
const { hasError, errorTitle, errorText, resetError, handleLoginError } = useErrorHandler()
const localePath = useLocalePath()
const { showSuccess } = useToastNotification()
const { t } = useI18n()

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
    await refreshSession()
    showSuccess('pages.login.successMessageTitle', 'pages.login.successMessage')
    await navigateTo(localePath('/dashboard'))
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
