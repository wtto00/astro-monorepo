/**
 * IMPORRTANT: don't delete IMPORT_COMPONENT and ROUTES
 */
import 'virtual:uno.css';
import '@unocss/reset/tailwind.css';

import { ViteSSG } from 'vite-ssg';

import App from './App.vue';
// IMPORRTANT: don't delete next line
// __IMPORT_COMPONENT__

export const createApp = ViteSSG(App, { routes: __ROUTES__, base: '__ROUTER_BASE__' });
