# vue-mpa

## 主要实现以下功能

- 一个项目，同时管理多个独立的 mpa 应用
- 每个 mpa 应用可单独部署
- 使用 unocss，每个 mpa 生成独立的 css 文件
- 使用 vite-ssg 打包，各个 mpa 应用独立打包

## 举例

```plaintext
- a/index.html
- b/index.html
- c
  - c1/index.html
  - c2/index.html
- d
  - d1
    - d1-1/index.html
    - d1-2/index.html
  - d2
    - d2-1/index.html
    - d2-2/index.html
  - d3/index.html
```

最终的访问路径如上图所示。

一共5个独立的 mpa 应用:

```json
["a", "b", "c", "d1-d2", "d3"]
```

其中d1和d2是同一个项目，只是路径不同而已，也就是说，d1和d2必须是同时部署的，不会出现单独部署的情况。

- 每个项目都可以单独的更新，不需要每次更新都所有项目全部覆盖。
- 使用 unocss 打包，a 项目中不会包含 a 项目没有用到的 css，即不会包括 其他所用的 css。

## 说明

### 模板

- `index.html`: 是所有项目的主入口模板。所有项目的入口都是基于此文件创建的。
- `src/main.ts`: 是所有项目的入口脚本模板。所有项目的入口脚本都是基于此文件创建的。
- `src/App.vue`: 是所有显示的主页面模板。所有项目的主页面都是基于此文件创建的。
- `public`: 是所有项目的公共文件。所有项目都是用此文件夹左右公共文件夹。

### 环境变量

`import.meta.env.MODE`

对于公共的模板文件，可以使用此环境变量来判断具体是哪个项目。

开发环境中，此环境变量为`development`，与各项目无关。

## 命令启动

### 开发环境运行

```shell
pnpm dev
```

`dev`命令可接受`vite`的全部参数。可输入`pnpm vite --help`查看。

除了`vite`的参数外，还可接受一个参数`--apps`，用于运行部分应用。

### 打包全部项目

注意虽然是打包全部项目，但是每个在`routes.config.ts`中配置的项目是独立的。

```shell
pnpm build
```

`build`命令只可接受一个参数`--apps`，用于打包部分应用。

### 启动部分应用

#### 开发环境运行部分项目

```shell
pnpm dev -- --apps a b c
```

只运行项目`a`,`b`,`c`。

由于`vite`不接受自定义参数，所以这里需要`-- --apps`，而不是`--apps`

#### 打包部分项目

```shell
pnpm build --apps a b c
```

只打包项目`a`,`b`,`c`。

## 配置

`routs.config.ts`文件中的`routesConfig`数据。

该配置是一个对象，对象的键是项目的名称，对象的值是该项目的具体配置信息，类型是`RouteConfig`。

其中`RouteConfig`中的参数:

- `base`: 打包部署后，应用访问url的基准路径。参见[vite配置](https://cn.vitejs.dev/config/shared-options.html#base)。

  **注意：** 开发环境将忽略该参数。

- `dist`: 打包后文件的位置，相对于根目录`dist`目录的相对位置。默认为项目名称。
- `paths`: 该项目的路由配置。是一个对象，对象的键为`vue-router`的`path`路径，对象的值为`vue-router`的`component`组件所对应的`vue`文件所在位置，相对于`src/pages`目录的相对位置。

  **注意：** 其中开发模式下，访问路由的键`path`值，都会有项目名称作为前缀。比如：配置`c`项目的路由是`/c1`，则在开发模式下，该路由会变为`/c/c1`。
