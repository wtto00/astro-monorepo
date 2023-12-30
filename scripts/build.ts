import { join, resolve } from 'node:path';
import routes from '../routes.config';
import { build } from 'vite-ssg/node';
import { existsSync, rmSync } from 'node:fs';
import { rootPath } from './util';

// 打包前清空dist文件夹
const distPath = resolve(rootPath, 'dist');
if (existsSync(distPath)) {
  rmSync(distPath, { recursive: true, force: true });
}

async function run() {
  const appNames = Object.keys(routes);

  for await (const appName of appNames) {
    const app = routes[appName];
    const base = join('/', app.base ?? '/', '/');

    console.info(`开始打包: ${appName}`);

    await build({
      base,
      mode: appName,
      dirStyle: 'nested',
      formatting: 'minify',
      entry: 'main.ts',
    });

    console.info(`打包 \`${appName}\` 成功`);
  }
}

void run();
