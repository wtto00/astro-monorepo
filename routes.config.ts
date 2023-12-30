interface RouteConfig {
  /**
   * 部署的路由基准路径
   * @default '/'
   */
  base?: string;
  /**
   * 打包后的文件夹，相对于dist文件夹的位置
   *
   * 默认： RouteConfig所对应的key值
   */
  dist?: string;
  /**
   * 路由path与组件路径的对应关系
   *
   * 组件路径是相对于pages文件夹的相对位置
   *
   * 暂不支持vue-router的其他选项
   */
  paths: Record<string, string>;
}

/**
 * 所有项目的路由配置
 */
const routesConfig: Record<string, RouteConfig> = {
  a: { paths: { '/': 'A.vue' } },
  b: { paths: { '/': 'B.vue' } },
  c: { paths: { '/c1': 'C/C1.vue', '/c2': 'C/C2.vue' } },
  'd1-d2': {
    base: '/d/',
    dist: 'd/d1-d2',
    paths: {
      '/d1/d1-1': 'D/D1/D1-1.vue',
      '/d1/d1-2': 'D/D1/D1-2.vue',
      '/d2/d2-1': 'D/D2/D2-1.vue',
      '/d2/d2-2': 'D/D2/D2-2.vue',
    },
  },
  d3: {
    base: '/d/',
    dist: 'd/d3',
    paths: { '/': 'D/D3.vue' },
  },
};

export default routesConfig;
