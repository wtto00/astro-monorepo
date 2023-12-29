/**
 * IMPORRTANT: don't delete IMPORT_COMPONENT and ROUTES
 */
import { ViteSSG } from "vite-ssg";
import "virtual:uno.css";
import "@unocss/reset/tailwind.css";
import App from './App.vue'
// IMPORRTANT: don't delete next line
// __IMPORT_COMPONENT__

export const createApp = ViteSSG(App, { routes: __ROUTES__ });
