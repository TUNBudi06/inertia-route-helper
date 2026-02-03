/**
 * Vue 3 Application Setup Example
 *
 * This file shows how to properly initialize the Inertia Route Helper
 * in a Vue 3 + Inertia.js application using the new /init import path.
 */

import { createApp, h } from 'vue';
import { createInertiaApp } from '@inertiajs/vue3';
import { initRouteHelper } from '@tunbudi06/inertia-route-helper/init';

const appName = 'My Inertia App';

createInertiaApp({
  title: (title) => `${title} - ${appName}`,

  resolve: (name) => {
    const pages = import.meta.glob('./Pages/**/*.vue', { eager: true });
    return pages[`./Pages/${name}.vue`];
  },

  setup({ el, App, props, plugin }) {
    // ✅ Initialize route helper with props
    // Automatically extracts baseUrl from props.initialPage.props.baseUrl
    initRouteHelper(props);

    // Optional: Apply additional configuration
    // import { configure } from '@tunbudi06/inertia-route-helper/init';
    // configure({
    //   trailingSlash: true,
    //   validateRoutes: import.meta.env.DEV
    // });

    createApp({ render: () => h(App, props) })
      .use(plugin)
      .mount(el);
  },

  progress: {
    color: '#4B5563',
  },
});

/**
 * Alternative: Manual Configuration
 *
 * If you need to set baseUrl manually:
 */

// import { configure } from '@tunbudi06/inertia-route-helper/init';
//
// configure({
//   baseUrl: import.meta.env.VITE_APP_URL || 'http://localhost:8000',
//   trailingSlash: false,
//   validateRoutes: true
// });

/**
 * Using with Vue Router (if needed)
 */

// import { createRouter, createWebHistory } from 'vue-router';
// import { configure } from '@tunbudi06/inertia-route-helper/init';
//
// const router = createRouter({
//   history: createWebHistory(),
//   routes: []
// });
//
// configure({
//   baseUrl: router.options.history.base || ''
// });
