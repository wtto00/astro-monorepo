import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";
import UnoCSS from "unocss/vite";
import { createVirtualFiles, rootPath } from "./scripts/util";
import { resolve } from "node:path";

// https://vitejs.dev/config/
export default defineConfig(({ command, mode }) => {
  const appName = command === "serve" ? ".dev" : mode;
  const res = createVirtualFiles(appName);
  const dist = res.dist;
  const input = res.indexPath;

  return {
    root: resolve(rootPath, `.vue-mpa/${appName}`),
    publicDir: resolve(rootPath, "public"),
    plugins: [vue(), UnoCSS()],
    resolve: {
      alias: {
        "@": resolve(rootPath, "src"),
      },
    },
    build: {
      outDir: dist,
      emptyOutDir: true,
      rollupOptions: {
        input: input,
      },
    },
  };
});
