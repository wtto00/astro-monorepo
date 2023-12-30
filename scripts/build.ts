import { join, resolve, dirname } from "node:path";
import routes from "../routes.config";
import { build } from "vite-ssg/node";
import { existsSync, rmSync } from "node:fs";
import { relative, rootPath, createVirtualFiles } from "./util";

// 打包前清空dist文件夹
const distPath = resolve(rootPath, "dist");
if (existsSync(distPath)) {
  rmSync(distPath, { recursive: true, force: true });
}

async function run() {
  const appNames = Object.keys(routes);

  for (let i = 0; i < appNames.length; i++) {
    const appName = appNames[i];
    const app = routes[appName];
    const base = join("/", app.base ?? "/", "/");

    console.info(`开始打包: ${appName}`);

    const { indexPath } = createVirtualFiles(appName);

    const dist = relative(
      dirname(indexPath),
      resolve(rootPath, "dist", app.dist ?? appName ?? "/")
    );

    await build({
      base,
      mode: appName,
      dirStyle: "nested",
      formatting: "minify",
      entry: "main.ts",
    });

    console.info(`打包 \`${appName}\` 成功`);
  }
}

void run();
