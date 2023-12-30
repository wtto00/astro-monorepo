# vue-mpa

## TODO

- [x] dev开发模式运行
- [x] 代码格式化
- [x] 依赖提醒机器人
- [x] 接收参数来打包或运行单个或多个项目

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
