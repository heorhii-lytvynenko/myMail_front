import { defineConfig } from 'vitest/config'
import { fileURLToPath } from 'node:url'

const root = fileURLToPath(new URL('.', import.meta.url))
export default defineConfig({
  resolve: { alias: [
    { find: /^.*\.svg\?react$/, replacement: `${root}tests/svg.tsx` },
    { find: '@shared', replacement: `${root}app/_shared` },
    { find: 'app', replacement: `${root}app` },
    { find: 'i18n', replacement: `${root}i18n` },
    { find: 'server-only', replacement: `${root}tests/server-only.ts` },
  ] },
  test: { environment: 'node', include: ['tests/**/*.test.{ts,tsx}'], clearMocks: true, restoreMocks: true },
})
