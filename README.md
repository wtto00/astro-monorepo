# vite-multiple-packages

一个 [Vite](https://cn.vitejs.dev/) + [Vue 3](https://v3.cn.vuejs.org/) 项目模板
实现多个单独的项目共用一些组件

## 开始前

1. 修改 `package.json` 文件中的 `name`，`license` 等信息  
   私有的项目，更改 `"license":"MIT"` 为 `"private":true` ，并删除根目录的 `LICENSE` 文件。
1. 在 `template` 文件夹内根据自己的实际需要修改，也可以创建项目后，在项目的目录内单独修改
   - `index.html`页面默认标题以及默认的图标等
   - `config.json`默认的环境变量，包含`打包时`以及`运行时`
   - `App.vue`vue 的默认的入口文件
   - `main.js`项目入口文件，如果项目都不需要用到 `router` 以及 `pinia`，可以在这里删除掉相关代码，并删除 `package.json` 中的相关依赖
1. [UnoCSS](https://github.com/unocss/unocss) 根字体大小是按照设计稿尺寸为`750px`，如果不是可在模板文件中的`App.vue`中修改
   ```css
   @media screen and (max-width: 750px) {
     html {
       font-size: calc(100vw * 16 / [设计稿宽度]);
     }
   }
   body {
     max-width: 750px;
   }
   ```
   针对 H5 页面，设置最大显示宽度为 750px，大于此宽度的窗口，将以 750px 显示，且在整个窗口居中。如果要更改最大显示宽度，可更改`App.vue`中上述代码中的 750px 为你要设置的值

## 创建项目

```shell
# pnpm
pnpm new:project [projectName]

# yarn
yarn new:project [projectName]

# npm
npm run new:project [projectName]
```

模板文件在 `template` 文件夹内  
自动创建项目文件在 `src/packages/[projectName]/` 文件夹内

## 环境变量

**不要在根目录添加 `.env` 以及 `.env.*` 文件**  
**不要在根目录添加 `.env` 以及 `.env.*` 文件**  
**不要在根目录添加 `.env` 以及 `.env.*` 文件**  
环境变量写在项目目录下的 `config.json`中
|参数|名称|类型|备注|
|----|---|-------|---|
|name|应用名称|string|用于启动或者打包时，选择显示的应用名称|
|env|默认环境变量|object|相当于标准 `vite` 项目的[.env 文件](https://cn.vitejs.dev/guide/env-and-mode.html#env-files)|
|modeEnv|vite 各模式下的环境变量|object|*key*为[vite 模式名称](https://cn.vitejs.dev/guide/env-and-mode.html#modes)<br />*value*为[vite 环境变量](https://cn.vitejs.dev/guide/env-and-mode.html)，相当于标准 `vite` 项目的[.env.[mode] 文件](https://cn.vitejs.dev/guide/env-and-mode.html#env-files)|
|runEnv|vite 运行时的环境变量|object|比如每个项目的 `rouer-base` 不同，可以配置个变量`ROUTER_BASE`，在`vite.config.js`中配置`base=process.env.ROUTER_BASE`|
|modeRunEnv|vite 各模式下运行时的环境变量|object|每种模式下的运行时环境变量，同名会覆盖默认 runEnv|
|disabled|禁用项目|bool|禁用后，启动或打包不再显示|

env 中默认值

```text
VITE_ROUTE_MODE=history
```

runEnv 中的默认值

```text
PROJECT_NAME=[projectName]
```

## 启动、打包

`cli` 脚本的参数同 `vite-cli` 参数一致

```shell
# 启动
pnpm dev [--Options]

# 打包
pnpm build [--Options]

# 也可以用yarn/npm
```

```text
Options:
  --host [host]           [string] specify hostname
  --port <port>           [number] specify port
  --https                 [boolean] use TLS + HTTP/2
  --open [path]           [boolean | string] open browser on startup
  --cors                  [boolean] enable CORS
  --strictPort            [boolean] exit if specified port is already in use
  --force                 [boolean] force the optimizer to ignore the cache and re-bundle
  -c, --config <file>     [string] use specified config file
  --base <path>           [string] public base path (default: /)
  -l, --logLevel <level>  [string] info | warn | error | silent
  --clearScreen           [boolean] allow/disable clear screen when logging
  -d, --debug [feat]      [string | boolean] show debug logs
  -f, --filter <filter>   [string] filter debug logs
  -m, --mode <mode>       [string] set env mode
  -h, --help              Display this message
  -v, --version           Display version number
```

## 公共部分

1. **router**
   `src/router/index.js`文件中可以定义所有项目都需要的页面，比如登陆授权页面
1. **pinia**
   `src/store/inedx.js`文件中可以定义所有项目都需要的响应式数据

   ```js
   import useStore from '@/store';

   const store = useStore();
   // 可使用store访问或处理公共数据
   ```

1. **assets**
   `src/assets`文件夹内的资源文件，在每个项目都可以用`@/assets/xxx`来访问
1. **components**
   `src/components`文件夹内的公共组件，每个项目都可以使用`@/components/xxx`来访问
1. **views**
   `src/views`文件夹内放所有项目都要用到的公共页面，比如登陆授权页面
1. **public**
   [Vite 文档 public 目录](https://cn.vitejs.dev/guide/assets.html#the-public-directory)

## 其他

1. 目前测试的脚本执行环境是 nodejs v16.13.2

## 推荐插件

1. 打包体积大小分析 [rollup-plugin-visualizer](https://github.com/btd/rollup-plugin-visualizer)
1. gzip/brotli 等压缩 [vite-plugin-compression](https://github.com/vbenjs/vite-plugin-compression/blob/main/README.zh_CN.md)
1. html 压缩以及模板等 [vite-plugin-html](https://github.com/vbenjs/vite-plugin-html/blob/main/README.zh_CN.md)
