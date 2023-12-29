/// <reference types="vite/client" />

declare module "*.vue" {
  import type { DefineComponent } from "vue";
  const component: DefineComponent<{}, {}, unknown>;
  export default component;
}

declare const __ROUTES__: any

interface RouteConfig {
  /**
   * 部署的路由基准路径
   * @default '/'
   */
  base?: string;
  /**
   * 打包后的文件夹，相对于dist文件夹的位置
   * 默认： RouteConfig所对应的key值
   */
  dist?: string;
  /**
   * 路径与组件路径的对应关系
   * 组件路径是相对于pages文件夹的相对位置
   * 暂不支持vue-router的其他选项
   */
  paths: Record<string, string>;
}