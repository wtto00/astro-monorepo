import { defineConfig } from 'astro/config'
import UnoCSS from 'unocss/astro'

// https://astro.build/config
export default defineConfig({
  srcDir: import.meta.env.DEV ? './src' : './astro-monorepo',
  base: process.env.ASTRO_MONOREPO_BASE || '/',
  outDir: process.env.ASTRO_MONOREPO_DIST || './dist',
  trailingSlash: 'never',
  integrations: [
    UnoCSS({
      injectReset: true,
      mode: 'dist-chunk',
      injectEntry: process.env.NODE_ENV === 'development',
    }),
  ],
  build: {
    format: 'file',
  },
})
