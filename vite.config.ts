import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import UnoCSS from 'unocss/vite';
import { createVirtualFiles, rootPath } from './scripts/util';
import { dirname, resolve } from 'node:path';

// https://vitejs.dev/config/
export default defineConfig(({ command, mode }) => {
  const appName = command === 'serve' ? '.dev' : mode;
  const { indexPath } = createVirtualFiles(appName);

  return {
    root: dirname(indexPath),
    publicDir: resolve(rootPath, 'public'),
    plugins: [vue(), UnoCSS()],
    resolve: {
      alias: {
        '@': resolve(rootPath, 'src'),
      },
    },
    build: {
      emptyOutDir: true,
      rollupOptions: {
        input: indexPath,
      },
    },
  };
});
