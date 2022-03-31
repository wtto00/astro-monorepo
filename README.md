# vite-multiple-packages

一个 [Vite](https://cn.vitejs.dev/) + [Vue 3](https://v3.cn.vuejs.org/) 项目模板
多个单独的项目共用一些组件

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
环境变量写在项目目录下的 `config.js`中，不存在改配置文件时，读取的是模板的`template/config.js`配置文件
|参数|名称|类型|备注|
|----|---|-------|---|
|name|应用名称|string|用于启动或者打包时，选择显示的应用名称|
|env|默认环境变量|object|`key` 以 \_VITE\_\_ 开头，`value` 必须为*字符串*，暴露给客户端|
|modeEnv|vite 各模式下的环境变量|object|同上|
|runEnv|vite 运行时的环境变量|object|比如每个项目的 `rouer-base` 不同，可以配置个变量`ROUTER_BASE`，在`vite.config.js`中配置`base:process.env.ROUTER_BASE`|
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
   `src/views`文件夹内放所有项目都要用到的公共页面

## 其他

1. 目前测试的脚本执行环境是 nodejs v16.13.2
1. 别忘记更改协议，私有的项目，在`packages.json`中，更改`"license":"MIT"`为`"private":true`，并删除根目录的`LICENSE`文件。
1. 新建项目选择了`vue-router`和`pinia`，如果本地没有安装，别忘记手动安装`pnpm add vue-router pinia`。
