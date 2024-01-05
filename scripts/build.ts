import { spawnSync } from 'node:child_process'
import { cpSync, existsSync, mkdirSync, renameSync, rmSync } from 'node:fs'
import { extname, join, posix, resolve } from 'node:path'
import { fileURLToPath, URL } from 'node:url'

import { globSync } from 'glob'
import parser from 'yargs-parser'

/** 项目根目录 */
const rootPath = fileURLToPath(new URL('..', import.meta.url))

/** 虚拟目录 */
const virtualDir = resolve(rootPath, 'astro-monorepo', 'pages')

/** 清空虚拟目录 */
if (existsSync(virtualDir)) {
  rmSync(virtualDir, { recursive: true })
}
mkdirSync(virtualDir, { recursive: true })

/** 获取参数 */
const args = parser(process.argv.slice(2))
/** 接收到的页面参数 */
process.env.ASTRO_MONOREPO_BASE = (args.base as string) || '/'
process.env.ASTRO_MONOREPO_DIST = args.dist ? join('dist', args.dist as string) : './dist'
const buildPages = globSync(args._.map((page) => `src/pages/${page}.*`))

/** 复制要打包的页面到虚拟目录 */
buildPages.forEach((page) => {
  cpSync(resolve(rootPath, page), resolve(virtualDir, posix.relative('src/pages', page)), {
    recursive: true,
  })
})

/** 开始打包 */
console.log(`开始打包 ${buildPages.join()}`)
spawnSync('pnpm', ['astro build'], {
  encoding: 'utf8',
  stdio: 'inherit',
  shell: true,
})

/** 仅有一个页面时，重命名打包的html名称为index.html */
if (buildPages.length === 1) {
  const pagePath = buildPages[0]
  if (pagePath) {
    const pageName = posix.relative('src/pages', pagePath)
    const htmlName = `${pageName.substring(0, pageName.length - extname(pageName).length)}.html`
    renameSync(
      resolve(process.env.ASTRO_MONOREPO_DIST, htmlName),
      resolve(process.env.ASTRO_MONOREPO_DIST, 'index.html')
    )
  }
}
