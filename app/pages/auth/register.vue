<script setup lang="ts">
import type { FormSubmitEvent, AuthFormField } from '@nuxt/ui'
import type { RegisterForm } from '~/composables/useValidation'

definePageMeta({
  layout: 'auth'
})

const { createRegisterFormSchema } = useValidation()
const { registerUser } = useAuthApi()
const { hasError, errorTitle, errorText, resetError, handleRegistrationError } = useErrorHandler()
const { t } = useI18n()
const toast = useToast()

const schema = createRegisterFormSchema()
const isSubmitting = ref(false)

const fields: AuthFormField[] = [{
  name: 'email',
  type: 'email',
  label: t('pages.register.email'),
  placeholder: t('pages.register.placeHolderEmail'),
  required: true
}, {
  name: 'password',
  label: t('pages.register.password'),
  type: 'password',
  placeholder: t('pages.register.placeHolderPassword'),
  required: true
}, {
  name: 'passwordConfirm',
  label: t('pages.register.confirmPassword'),
  type: 'password',
  placeholder: t('pages.register.placeHolderConfirmPassword'),
  required: true
}]

const handleSuccess = async (): Promise<void> => {
  toast.add({
    title: t('pages.register.successMessageTitle'),
    description: t('pages.register.successMessage'),
    color: 'success'
  })
  await navigateTo('/auth/login')
}

const onSubmit = async (event: FormSubmitEvent<RegisterForm>): Promise<void> => {
  if (isSubmitting.value) {
    return
  }
  resetError()
  isSubmitting.value = true

  try {
    const payload: RegisterUserRequestDTO = {
      email: event.data.email,
      password: event.data.password
    }
    await registerUser(payload)
    await handleSuccess()
  } catch (error: unknown) {
    handleRegistrationError(error)
  } finally {
    isSubmitting.value = false
  }
}
</script>

<template>
  <UAuthForm
    :schema="schema"
    :fields="fields"
    :title="$t('pages.register.title')"
    :submit="{
      label: $t('pages.register.createAccount'),
      color: 'primary',
      loading: isSubmitting
    }"
    @submit="onSubmit"
  >
    <template #description>
      {{ $t('pages.register.alreadyHaveAccount') }} <NuxtLinkLocale
        to="/auth/login"
        class="text-primary font-medium"
      >
        {{ $t('nav.login') }}
      </NuxtLinkLocale>
    </template>
    <template #password-hint>
      <NuxtLinkLocale
        to="/auth/forgot-password"
        class="text-primary font-medium"
      >
        {{ $t('pages.register.forgotPassword') }}
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
      {{ $t('pages.register.termsHint') }}
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
