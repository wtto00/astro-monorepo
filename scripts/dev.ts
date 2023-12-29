import { resolve, extname, posix } from "node:path";
import { readdirSync, statSync } from "node:fs";
import {
  rootPath,
  relative,
  createVirtualFiles,
  str2IdentityName,
} from "./util";
import { mergeConfig } from "vite";
import defaultViteConfig from "../vite.config";
import { createServer } from "vite";
import { spawnSync } from "node:child_process";

const pagesPath = resolve(rootPath, "src/pages");
const files = readdirSync(pagesPath);

const routes: string[] = [];
const components: string[] = [];

function buildRoutes(pages = files, parent = pagesPath) {
  const parentRoute = relative(pagesPath, parent);
  pages.forEach((page) => {
    const filePath = resolve(parent, page);
    if (statSync(filePath).isFile()) {
      const componentName = str2IdentityName(page);
      components.push(
        `import ${componentName} from "@/pages/${relative(
          pagesPath,
          filePath
        )}";`
      );
      const route = posix.join(parentRoute, page);
      const routePath = route
        .substring(0, route.length - extname(route).length)
        .toLocaleLowerCase();
      routes.push(`{path:"/${routePath}",component:${componentName}}`);
    } else {
      // directery
      const subPages = readdirSync(filePath);
      buildRoutes(subPages, filePath);
    }
  });
}
buildRoutes();

const { virtualAppPath, indexPath } = createVirtualFiles(
  ".dev",
  routes,
  components
);

spawnSync(
  "pnpm",
  ["vite", "--config", resolve(rootPath, "vite.config.ts"), virtualAppPath],
  {
    shell: true,
    stdio: "inherit",
  }
);
