import { defineConfig } from 'vitest/config'
import { defineVitestProject } from '@nuxt/test-utils/config'
import { loadEnv } from 'vite'

export default defineConfig({
  test: {
    env: loadEnv('', process.cwd(), ''),
    projects: [
      {
        test: {
          name: 'unit',
          include: ['tests/unit/*.{test,spec}.ts'],
          environment: 'node'
        }
      },
      {
        test: {
          name: 'e2e',
          include: ['tests/e2e/*.{test,spec}.ts'],
          environment: 'node'
        }
      },
      await defineVitestProject({
        test: {
          name: 'nuxt',
          include: ['tests/nuxt/*.{test,spec}.ts'],
          environment: 'nuxt'
        }
      })
    ]
  }
})
