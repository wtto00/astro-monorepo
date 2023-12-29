import { cpSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { extname, posix, resolve, sep } from "node:path";
import { URL, fileURLToPath, pathToFileURL } from "node:url";

/**
 * 项目根目录
 */
export const rootPath = fileURLToPath(new URL("..", import.meta.url));

/**
 * 创建项目虚拟文件
 * @param appName 项目名称
 * @param routes 路由数组，js字符串
 * @param components 组件导入的js字符串
 */
export function createVirtualFiles(
  appName: string,
  routes: string[],
  components: string[]
) {
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
  writeFileSync(
    mainPath,
    mainTemplate
      .replace("__ROUTES__", `[${routes.join(',')}]`)
      .replace("// __IMPORT_COMPONENT__", components.join('\n'))
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

  return {
    indexPath,
    virtualAppPath,
  };
}

/**
 * 字符串转为js中合法的变量名
 */
export function str2IdentityName(str: string) {
  return (
    "_" +
    str
      .substring(0, str.length - extname(str).length)
      .replace(/(?![a-zA-Z0-9_])./g, "_")
  );
}

/**
 * 相对路径转为url字符串，兼容Windows
 * @param fromPath 从这个路径
 * @param toPath 到这个路径
 * @returns 的相对路径
 */
export function relative(fromPath: string, toPath: string) {
  if (sep === "/") return posix.relative(fromPath, toPath);
  return posix.relative(
    pathToFileURL(fromPath).pathname,
    pathToFileURL(toPath).pathname
  );
}
