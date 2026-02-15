import { fileURLToPath } from 'node:url'

// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  modules: [
    '@nuxt/eslint',
    '@nuxt/content',
    '@nuxt/ui',
    '@nuxtjs/i18n',
    '@nuxt/test-utils/module',
    'nuxt-security',
    'nuxt-auth-utils'
  ],
  devtools: {
    enabled: true
  },
  css: ['~/assets/css/main.css'],
  /* runtimeConfig: {
    // The private keys which are only available server-side
    logLevel: 'info',
    // Keys within public are also exposed client-side
    public: {
      apiBase: ''
    }
  }, */
  alias: {
    '@server': fileURLToPath(new URL('./server', import.meta.url)),
    '@contracts': fileURLToPath(new URL('./server/contracts', import.meta.url)),
    '@services': fileURLToPath(new URL('./server/services', import.meta.url)),
    '@infrastructure': fileURLToPath(new URL('./server/infrastructure', import.meta.url)),
    '@generated': fileURLToPath(new URL('./generated', import.meta.url))
  },
  routeRules: {
    '/': { prerender: true }
  },

  compatibilityDate: '2025-01-15',

  eslint: {
    config: {
      stylistic: {
        commaDangle: 'never',
        braceStyle: '1tbs'
      }
    }
  },
  i18n: {
    strategy: 'prefix',
    defaultLocale: 'en',
    detectBrowserLanguage: {
      useCookie: true,
      cookieKey: 'i18n_redirected',
      redirectOn: 'root'
    },
    locales: [
      { code: 'en', name: 'English', file: 'en.json' },
      { code: 'de', name: 'Deutsch', file: 'de.json' }
    ]
  }
})
