import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import { fileURLToPath, URL } from 'url';
import Unocss from 'unocss/vite';

// https://vitejs.dev/config/
export default defineConfig({
  root: `./src/packages/${process.env.PROJECT_NAME}/`,
  plugins: [vue({ reactivityTransform: true }), Unocss()],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
      [process.env.PROJECT_NAME]: fileURLToPath(new URL(`./src/packages/${process.env.PROJECT_NAME}`, import.meta.url)),
    },
  },
  build: {
    outDir: fileURLToPath(new URL('./dist', import.meta.url)),
    emptyOutDir: false,
  },
});
