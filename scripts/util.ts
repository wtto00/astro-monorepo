import { cpSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { dirname, extname, posix, resolve, sep } from 'node:path';
import { URL, fileURLToPath, pathToFileURL } from 'node:url';
import routes from '../routes.config';

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

  const dist =
    appName === '.dev' ? '' : relative(dirname(indexPath), resolve(rootPath, 'dist', app?.dist ?? appName ?? '/'));

  return { indexPath, dist };
}

/**
 * 开发环境时，获取所有的陆游与组件对应关系
 */
function getAllPaths() {
  const appNames = Object.keys(routes);

  const paths = {} as Record<string, string>;

  for (const appName of appNames) {
    const app = routes[appName];
    Object.keys(app.paths).forEach((routePath) => {
      const route = posix.join(appName, routePath);
      paths[`/${route}`] = app.paths[routePath];
    });
  }
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
