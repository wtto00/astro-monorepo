import { dirname, resolve } from 'node:path';

import vue from '@vitejs/plugin-vue';
import UnoCSS from 'unocss/vite';
import { defineConfig } from 'vite';

import { createVirtualFiles, getEnvs, rootPath } from './scripts/util';

// https://vitejs.dev/config/
export default defineConfig(({ command, mode }) => {
  const appName = command === 'serve' ? '.dev' : mode;
  const { indexPath } = createVirtualFiles(appName);
  const envs = getEnvs(appName);

  return {
    root: dirname(indexPath),
    publicDir: resolve(rootPath, 'public'),
    plugins: [vue(), UnoCSS()],
    resolve: {
      alias: {
        '@': resolve(rootPath, 'src'),
      },
    },
    define: envs.reduce((prev, curr) => {
      const [key, value] = curr.split('=');
      prev[`import.meta.env.${key}`] = JSON.stringify(value);
      return prev;
    }, {}),
    build: {
      emptyOutDir: true,
      rollupOptions: {
        input: indexPath,
      },
    },
  };
});
