import { ViteSSG } from "vite-ssg";
import { h, resolveComponent } from "vue";
const App = h(resolveComponent("RouterView"));
const createApp = ViteSSG(App, { routes: __ROUTES__ });
export {
  createApp
};
