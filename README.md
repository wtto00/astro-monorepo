# Astro Monorepo

`astro`一起打包多个页面时，有一些问题：

- 许多`css`和`js`混杂在一起，无法单独部署单个页面或其中的一些页面。
- `unocss`把所有页面的样式全都打包了，即使单个页面没有包含的样式。

## 使用

```shell
# 单独打包a.astro
pnpm build a

# 单独打包b.astro
pnpm build b

# 同时打包a.astro&b.astro，两个页面的css会混杂在一起
pnpm build a b
```

## 参数

|  名称  |  默认值  |                                                 备注                                                  |
| :----: | :------: | :---------------------------------------------------------------------------------------------------: |
|  base  |   '/'    |  [import.meta.env.BASE_URL](https://docs.astro.build/zh-cn/reference/configuration-reference/#base)   |
|  dist  | './dist' | [outDir](https://docs.astro.build/zh-cn/reference/configuration-reference/#outdir),相对于`dist`的目录 |
| rename |   true   |                                   单个页面是否重命名为`index.html`                                    |

## 示例

```plaintext
- a/index.html
- b/index.html
- c
  - c1.html
  - c2.html
- d
  - d1
    - d1-1.html
    - d1-2.html
  - d2
    - d2-1.html
    - d2-2.html
  - d3.html
```

最终的访问路径如上图所示。

一共5个独立的 mpa 应用:

```json
["a", "b", "c", "d1-d2", "d3"]
```

其中d1和d2是同一个项目，只是路径不同而已，也就是说，d1和d2必须是同时部署的，不会出现单独部署的情况。

可以分别对每个项目单独打包，单独部署

```shell
pnpm build a --base /a/ --dist /a/

pnpm build b --base /b/ --dist /b/

pnpm build "c/*" --base /c/

pnpm build "d/d1/*" "d/d2/*" --base /d/

pnpm build d/d3 --base /d/ --dist d --no-rename
```
