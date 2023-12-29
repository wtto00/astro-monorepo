import { relative, extname, join, resolve, dirname } from "node:path";
import routesConfig from "../config/routes.config";
import { build } from "vite-ssg/node";
import {
  cpSync,
  existsSync,
  mkdirSync,
  readFileSync,
  rmSync,
  writeFileSync,
} from "node:fs";
import { URL, fileURLToPath } from "node:url";

const rootPath = fileURLToPath(new URL("..", import.meta.url));

// 打包前清空dist文件夹
const distPath = resolve(rootPath, "dist");
if (existsSync(distPath)) {
  rmSync(distPath, { recursive: true });
}

const apps = Object.keys(routesConfig);

for (let i = 0; i < apps.length; i++) {
  const appName = apps[i];
  const app = routesConfig[appName];
  const base = join("/", app.base ?? "/", "/");

  /**
   * 创建项目虚拟目录
   * 创建index.html
   * 创建main.ts
   */
  const virtualAppPath = resolve(rootPath, `.vue-mpa/${appName}`);
  mkdirSync(virtualAppPath, { recursive: true });
  // index.html
  const indexPath = resolve(virtualAppPath, "index.html");
  const indexTemplate = readFileSync(resolve(rootPath, "index.html"), {
    encoding: "utf8",
  });
  writeFileSync(indexPath, indexTemplate.replace("/src/main.ts", `/main.ts`), {
    encoding: "utf8",
  });
  // main.ts
  const mainPath = resolve(virtualAppPath, "main.ts");
  const mainTemplate = readFileSync(resolve(rootPath, "src/main.ts"), {
    encoding: "utf8",
  });
  const paths = Object.keys(app.paths);
  let routes = "[";
  let components = [] as string[];
  paths.forEach((path) => {
    const file = app.paths[path];
    // string to valid identifier name
    const componentName =
      "_" +
      file
        .substring(0, file.length - extname(file).length)
        .replace(/(?![a-zA-Z0-9_])./g, "_");
    components.push(`import ${componentName} from "@/pages/${file}"`);
    routes += `{path:"${path}",component:${componentName}},`;
  });
  routes += "]";
  writeFileSync(
    mainPath,
    mainTemplate
      .replace("__ROUTES__", routes)
      .replace("// __IMPORT_COMPONENT__", components.join("\n"))
      .replace("// IMPORRTANT: don't delete next line\n", "")
      .replace(
        "/**\n * IMPORRTANT: don't delete IMPORT_COMPONENT and ROUTES\n */\n",
        ""
      ),
    { encoding: "utf8" }
  );
  // App.vue
  const appTemplate = resolve(rootPath, "src/App.vue");
  const appPath = resolve(virtualAppPath, "App.vue");
  cpSync(appTemplate, appPath);
  // .env.local
  writeFileSync(resolve(rootPath, ".env.local"), `VITE_APP_NAME=${appName}`, {
    encoding: "utf8",
  });

  const dist = relative(
    dirname(indexPath),
    resolve(rootPath, "dist", app.dist ?? appName ?? "/")
  );

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
  console.info(`打包 ${appName} 成功`);
}
