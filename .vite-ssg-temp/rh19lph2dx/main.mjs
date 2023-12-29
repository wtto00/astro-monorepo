import { ViteSSG } from "vite-ssg";
import { resolveComponent, useSSRContext } from "vue";
import { ssrRenderComponent } from "vue/server-renderer";
const _export_sfc = (sfc, props) => {
  const target = sfc.__vccOpts || sfc;
  for (const [key, val] of props) {
    target[key] = val;
  }
  return target;
};
const _sfc_main = {};
function _sfc_ssrRender(_ctx, _push, _parent, _attrs) {
  const _component_RouterView = resolveComponent("RouterView");
  _push(ssrRenderComponent(_component_RouterView, _attrs, null, _parent));
}
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("src/App.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
const App = /* @__PURE__ */ _export_sfc(_sfc_main, [["ssrRender", _sfc_ssrRender]]);
const __variableDynamicImportRuntimeHelper = (glob, path) => {
  const v = glob[path];
  if (v) {
    return typeof v === "function" ? v() : Promise.resolve(v);
  }
  return new Promise((_, reject) => {
    (typeof queueMicrotask === "function" ? queueMicrotask : setTimeout)(reject.bind(null, new Error("Unknown variable dynamic import: " + path)));
  });
};
const routesConfig = {
  a: { paths: { "/": "A" } },
  b: { paths: { "/": "B" } },
  c: { paths: { "/c1": "C/C1.vue", "/c2": "C/C2.vue" } },
  "d1-d2": {
    base: "/d/",
    dist: "d/d1-d2",
    paths: {
      "/d1/d1-1": "D/D1/D1-1.vue",
      "/d1/d1-2": "D/D1/D1-2.vue",
      "/d2/d2-1": "D/D2/D2-1.vue",
      "/d2/d2-2": "D/D2/D2-2.vue"
    }
  },
  d3: {
    base: "/d/",
    dist: "d/d3",
    paths: { "/": "D/D3.vue" }
  }
};
const appName = process.env.VITE_APP_NAME;
async function getRoutes() {
  if (!appName)
    return [];
  const routeConfig = routesConfig[appName];
  if (!routeConfig)
    return [];
  const allRoutes = [];
  const allPaths = Object.keys(routeConfig.paths);
  for (let i = 0; i < allPaths.length; i++) {
    const path = allPaths[i];
    const component = await __variableDynamicImportRuntimeHelper(/* @__PURE__ */ Object.assign({ "../pages/A.vue": () => import("./assets/A-AB4lUnqf.js"), "../pages/B.vue": () => import("./assets/B-cGT8mmBU.js") }), `../pages/${routeConfig.paths[path]}.vue`);
    if (component) {
      allRoutes.push({ path, component });
    }
  }
  return allRoutes;
}
console.log(getRoutes());
const createApp = async (client, routePath) => {
  const routes = await getRoutes();
  return ViteSSG(
    App,
    { routes }
    // function to have custom setups
    // ({ app, router, routes, isClient, initialState }) => {
    //   // install plugins etc.
    // }
  )(client, routePath);
};
export {
  createApp
};
