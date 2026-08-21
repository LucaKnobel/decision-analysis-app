import { fileURLToPath } from 'node:url'
import { defineConfig } from 'vitest/config'
import { loadEnv } from 'vite'

const alias = {
  '@server': fileURLToPath(new URL('./server', import.meta.url)),
  '@contracts': fileURLToPath(new URL('./server/contracts', import.meta.url)),
  '@services': fileURLToPath(new URL('./server/services', import.meta.url)),
  '@infrastructure': fileURLToPath(new URL('./server/infrastructure', import.meta.url)),
  '@generated': fileURLToPath(new URL('./generated', import.meta.url))
}

export default defineConfig({
  test: {
    env: loadEnv('', process.cwd(), ''),
    fileParallelism: false,
    watch: false,
    pool: 'forks',
    poolOptions: {
      forks: {
        singleFork: true
      }
    },
    projects: [
      {
        resolve: { alias },
        test: {
          name: 'unit',
          include: ['test/unit/*.{test,spec}.ts'],
          environment: 'node'
        }
      },
      {
        resolve: { alias },
        test: {
          name: 'e2e',
          include: ['test/e2e/*.{test,spec}.ts'],
          environment: 'node'
        }
      }
    ]
  }
})
