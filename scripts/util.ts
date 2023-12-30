import { cpSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { extname, posix, resolve, sep } from 'node:path';
import { URL, fileURLToPath, pathToFileURL } from 'node:url';
import routes, { RouteConfig } from '../routes.config';

/**
 * 项目根目录
 */
export const rootPath = fileURLToPath(new URL('..', import.meta.url));

/**
 * 创建项目虚拟文件
 * @param appName 项目名称
 */
export function createVirtualFiles(appName: string) {
  const app = routes[appName];
  // 准备此项目的相关文件
  // 项目虚拟目录
  const virtualAppPath = resolve(rootPath, `.vue-mpa/${appName}`);
  mkdirSync(virtualAppPath, { recursive: true });
  // index.html
  const indexPath = resolve(virtualAppPath, 'index.html');
  const indexTemplate = readFileSync(resolve(rootPath, 'index.html'), {
    encoding: 'utf8',
  });
  writeFileSync(
    indexPath,
    indexTemplate.replace('<!-- __INJECT_MAIN_SCRIPT__ -->', '<script type="module" src="/main.ts"></script>'),
    { encoding: 'utf8' },
  );
  // main.ts
  const mainPath = resolve(virtualAppPath, 'main.ts');
  const mainTemplate = readFileSync(resolve(rootPath, 'src/main.ts'), {
    encoding: 'utf8',
  });
  const { routes: rotuesStr, components } = getMainInjected(appName === '.dev' ? getAllPaths() : app.paths);
  writeFileSync(
    mainPath,
    mainTemplate
      .replace('__ROUTES__', rotuesStr)
      .replace('// __IMPORT_COMPONENT__', components)
      .replace('// IMPORRTANT: don\'t delete next line\n', '')
      .replace('/**\n * IMPORRTANT: don\'t delete IMPORT_COMPONENT and ROUTES\n */\n', ''),
    { encoding: 'utf8' },
  );
  // App.vue
  const appTemplate = resolve(rootPath, 'src/App.vue');
  const appPath = resolve(virtualAppPath, 'App.vue');
  cpSync(appTemplate, appPath);

  return { indexPath };
}

/**
 * 根据命令传参，获取要打包或运行的项目集合
 */
export function filterInputApps() {
  const argvs = process.argv.slice(2);
  const appNames = [] as string[];
  let isApps = false;
  for (const argv of argvs) {
    if (isApps && !argv.startsWith('-')) {
      appNames.push(argv);
    } else if (isApps) {
      break;
    } else if (argv === '--apps') {
      isApps = true;
    }
  }
  if (appNames.length > 0) {
    const filterRoutes = Object.keys(routes).filter((appName) => appNames.includes(appName));
    if (filterRoutes.length === 0) {
      console.error(`${appNames.join()} 不是有效的项目，请在routes.config.ts定义`);
      process.exit(-1);
    }
    return filterRoutes.reduce((prev, curr) => ({ ...prev, [curr]: routes[curr] }), {} as Record<string, RouteConfig>);
  }
  return routes;
}

/**
 * 开发环境时，获取所有的路由与组件对应关系
 * 并创建首页
 */
function getAllPaths() {
  const appNames = Object.keys(filterInputApps());

  const paths = {} as Record<string, string>;

  const links = [] as string[];

  for (const appName of appNames) {
    const app = routes[appName];
    Object.keys(app.paths).forEach((routePath) => {
      const route = posix.join(appName, routePath.substring(1));
      paths[`/${route}`] = app.paths[routePath];
      links.push(`<RouterLink to="/${route}">/${route}</RouterLink>`);
    });
  }

  writeFileSync(
    resolve(rootPath, '.vue-mpa/.dev/Home.vue'),
    `<template>\n<div class="h-screen flex flex-col justify-center items-center c-blue space-y-2">\n${links.join(
      '\n',
    )}\n</div>\n</template>`,
    {
      encoding: 'utf8',
    },
  );
  paths['/'] = '../../.vue-mpa/.dev/Home.vue';

  return paths;
}

/**
 * 获取插入到main.ts中的数据
 */
function getMainInjected(paths: Record<string, string>) {
  const routePaths = Object.keys(paths);
  const routesStr: string[] = [];
  const components: string[] = [];
  routePaths.forEach((path) => {
    const file = paths[path];
    const componentName = str2IdentityName(file);
    components.push(`import ${componentName} from "@/pages/${file}";`);
    routesStr.push(`{path:"${path}",component:${componentName}}`);
  });
  return {
    routes: `[${routesStr.join(',')}]`,
    components: components.join('\n'),
  };
}

/**
 * 字符串转为js中合法的变量名
 */
export function str2IdentityName(str: string) {
  return '_' + str.substring(0, str.length - extname(str).length).replace(/(?![a-zA-Z0-9_])./g, '_');
}

/**
 * 相对路径转为url字符串，兼容Windows
 * @param fromPath 从这个路径
 * @param toPath 到这个路径
 * @returns 的相对路径
 */
export function relative(fromPath: string, toPath: string) {
  if (sep === '/') return posix.relative(fromPath, toPath);
  return posix.relative(pathToFileURL(fromPath).pathname, pathToFileURL(toPath).pathname);
}
