<script setup lang="ts">
import * as z from 'zod'
import type { RegisterRequestDTO } from '#shared/dtos/auth/register.request.dto'
import type { RegisterResponseDTO } from '#shared/dtos/auth/register.response.dto'
import type { FormSubmitEvent, AuthFormField } from '@nuxt/ui'

definePageMeta({
  layout: 'auth'
})

const RegisterFormSchema = z.object({
  email: z.email({ error: $t('validation.email.invalid') }),
  password: z.string({ error: $t('validation.password.required') })
    .min(12, { error: $t('validation.password.min') })
    .max(256, { error: $t('validation.password.max') })
    .regex(/[A-Z]/, { error: $t('validation.passwordUppercase') })
    .regex(/[a-z]/, { error: $t('validation.passwordLowercase') })
    .regex(/[0-9]/, { error: $t('validation.passwordNumber') })
    .regex(/[^A-Za-z0-9]/, { error: $t('validation.passwordSpecial') }),
  passwordConfirm: z.string({ error: $t('validation.password.required') })
}).refine(data => data.password === data.passwordConfirm, {
  error: $t('validation.passwordsMatch'),
  path: ['passwordConfirm']
})

export type RegisterForm = z.infer<typeof RegisterFormSchema>

const fields: AuthFormField[] = [{
  name: 'email',
  type: 'email',
  label: $t('pages.register.email'),
  placeholder: $t('pages.register.placeHolderEmail'),
  required: true
}, {
  name: 'password',
  label: $t('pages.register.password'),
  type: 'password',
  placeholder: $t('pages.register.placeHolderPassword'),
  required: true
}, {
  name: 'passwordConfirm',
  label: $t('pages.register.confirmPassword'),
  type: 'password',
  placeholder: $t('pages.register.placeHolderConfirmPassword'),
  required: true
}]

const isSubmitting = ref(false)
const submitErrorKey = ref<string | null>(null)

// Falls Nuxt UI Toast verfügbar ist:
const toast = useToast()

const onSubmit = async (event: FormSubmitEvent<RegisterForm>): Promise<void> => {
  submitErrorKey.value = null

  if (isSubmitting.value) {
    return
  }
  isSubmitting.value = true

  try {
    const payload: RegisterRequestDTO = {
      email: event.data.email,
      password: event.data.password
    }

    await $fetch<RegisterResponseDTO>('/api/auth/register', {
      method: 'POST',
      body: payload
    })

    // 1) Erfolgs-Toast anzeigen
    toast.add({
      title: 'Erfolgreich registriert',
      description: 'Bitte jetzt einloggen.'
      // color/variant je nach Nuxt UI Version möglich:
      // color: 'green'
    })

    // 2) Weiterleiten (kleiner Tick, damit Toast sicher gerendert wird)
    await nextTick()
    await navigateTo('auth/login')
  } catch (_err: unknown) {
    console.error('Registration failed', _err) // draffft
    submitErrorKey.value = 'registration.failed'
  } finally {
    isSubmitting.value = false
  }
}
</script>

<template>
  <UAuthForm
    :schema="RegisterFormSchema"
    :fields="fields"
    :title="$t('pages.register.title')"
    :submit="{
      label: $t('pages.register.createAccount'),
      color: 'primary'
    }"
    @submit="onSubmit"
  >
    <template #description>
      {{ $t('pages.register.alreadyHaveAccount') }} <NuxtLinkLocale
        to="/auth/login"
        class="text-primary font-medium"
      >
        {{ $t('nav.login') }}
      </NuxtLinkLocale>.
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
      <!-- <UAlert
        v-if="error"
        color="error"
        icon="i-lucide-alert-circle"
        :title="error"
      /> -->
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
