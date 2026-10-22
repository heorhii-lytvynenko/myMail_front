import { defineConfig } from 'vitest/config'
import { fileURLToPath } from 'node:url'

const root = fileURLToPath(new URL('.', import.meta.url))
export default defineConfig({
  resolve: { alias: { app: `${root}app`, i18n: `${root}i18n`, 'server-only': `${root}tests/server-only.ts` } },
  test: { environment: 'node', include: ['tests/**/*.test.{ts,tsx}'], clearMocks: true, restoreMocks: true },
})
