import { join, resolve, dirname } from "node:path";
import routes from "../routes.config";
import { build } from "vite-ssg/node";
import { existsSync, rmSync } from "node:fs";
import { relative, rootPath, createVirtualFiles, str2IdentityName } from "./util";

// 打包前清空dist文件夹
const distPath = resolve(rootPath, "dist");
if (existsSync(distPath)) {
  rmSync(distPath, { recursive: true });
}

const apps = Object.keys(routes);

for (let i = 0; i < apps.length; i++) {
  const appName = apps[i];
  const app = routes[appName];
  const base = join("/", app.base ?? "/", "/");

  console.info(`开始打包: ${appName}`);

  /**
   * 创建项目虚拟目录
   * 创建index.html
   * 创建main.ts
   */
  const paths = Object.keys(app.paths);
  const routesStr: string[] = [];
  const components: string[] = [];
  paths.forEach((path) => {
    const file = app.paths[path];
    const componentName = str2IdentityName(file);
    components.push(`import ${componentName} from "@/pages/${file}";`)
    routesStr.push(`{path:"${path}",component:${componentName}}`)
  });
  const { indexPath, virtualAppPath } = createVirtualFiles(
    appName,
    routesStr,
    components
  );

  const dist = relative(
    dirname(indexPath),
    resolve(rootPath, "dist", app.dist ?? appName ?? "/")
  );
  console.log(dist);

  await build(
    {
      base,
      dirStyle: "nested",
      formatting: "minify",
      entry: "main.ts",
    },
    {
      configFile: resolve(rootPath, "./vite.config.ts"),
      root: virtualAppPath,
      publicDir: resolve(rootPath, "public"),
      build: {
        outDir: dist,
        emptyOutDir: true,
        rollupOptions: {
          input: indexPath,
        },
      },
    }
  );
  console.info(`打包 \`${appName}\` 成功`);
}
