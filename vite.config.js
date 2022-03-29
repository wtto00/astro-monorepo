import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import { fileURLToPath, URL } from 'url';

// https://vitejs.dev/config/
export default defineConfig({
  root: `./src/packages/${process.env.PROJECT_NAME}/`,
  plugins: [vue({ reactivityTransform: true })],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
      [process.env.PROJECT_NAME]: fileURLToPath(new URL(`./src/packages/${process.env.PROJECT_NAME}`, import.meta.url)),
    },
  },
});
