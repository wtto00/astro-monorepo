import { existsSync, rmSync } from 'node:fs';
import { join, resolve } from 'node:path';

import { build } from 'vite-ssg/node';

import { filterInputApps, relative, rootPath } from './util';

// 打包前清空dist文件夹
const distPath = resolve(rootPath, 'dist');
if (existsSync(distPath)) {
  rmSync(distPath, { recursive: true, force: true });
}

const routes = filterInputApps();

async function run() {
  const appNames = Object.keys(routes);

  for await (const appName of appNames) {
    const app = routes[appName];
    const base = join('/', app.base ?? '/', '/');

    console.info(`开始打包: ${appName}`);

    const dist = resolve(distPath, app?.dist ?? appName ?? '/');

    await build(
      {
        base,
        mode: appName,
        dirStyle: 'nested',
        formatting: 'minify',
        entry: 'main.ts',
      },
      { build: { outDir: relative(resolve(rootPath, `.vue-mpa/${appName}`), dist) } },
    );

    // 删除.vite/ssr-manifest.json文件
    rmSync(resolve(dist, '.vite'), { recursive: true, force: true });

    // 如果没有根路由，则删掉index.html
    if (!app.component && !app.paths?.['/']) {
      rmSync(resolve(dist, 'index.html'));
    }

    console.info(`打包 \`${appName}\` 成功`);
  }
}

void run();
