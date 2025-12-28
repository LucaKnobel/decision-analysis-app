<template>
  <UHeader>
    <template #left>
      <NuxtLink to="/">
        <AppLogo />
      </NuxtLink>
      <TemplateMenu />
    </template>

    <template #right>
      <UColorModeButton />

      <UButton
        icon="i-lucide-log-in"
        color="neutral"
        variant="ghost"
        to="/auth/login"
        class="lg:hidden"
      />

      <UButton
        :label="$t('nav.login')"
        color="neutral"
        variant="outline"
        to="/auth/login"
        class="hidden lg:inline-flex"
      />

      <UButton
        :label="$t('nav.register')"
        color="neutral"
        trailing-icon="i-lucide-arrow-right"
        class="hidden lg:inline-flex"
        to="/auth/register"
      />
    </template>

    <template #body>
      <UButton
        :label="$t('nav.login')"
        color="neutral"
        variant="subtle"
        to="/auth/login"
        block
        class="mb-3"
      />
      <UButton
        :label="$t('nav.register')"
        color="neutral"
        to="/auth/register"
        block
      />
    </template>
  </UHeader>
</template>
