/**
 * 所有项目的路由配置
 */
const routesConfig: Record<string, RouteConfig> = {
  a: { paths: { "/": "A.vue" } },
  b: { paths: { "/": "B.vue" } },
  c: { paths: { "/c1": "C/C1.vue", "/c2": "C/C2.vue" } },
  "d1-d2": {
    base: "/d/",
    dist: "d/d1-d2",
    paths: {
      "/d1/d1-1": "D/D1/D1-1.vue",
      "/d1/d1-2": "D/D1/D1-2.vue",
      "/d2/d2-1": "D/D2/D2-1.vue",
      "/d2/d2-2": "D/D2/D2-2.vue",
    },
  },
  d3: {
    base: "/d/",
    dist: "d/d3",
    paths: { "/": "D/D3.vue" },
  },
};

export default routesConfig;
