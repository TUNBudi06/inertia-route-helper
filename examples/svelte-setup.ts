/**
 * Svelte Application Setup Example
 *
 * This file shows how to properly initialize the Inertia Route Helper
 * in a Svelte + Inertia.js application using the new /init import path.
 */

import { createInertiaApp } from '@inertiajs/svelte';
import { initRouteHelper } from '@tunbudi06/inertia-route-helper/init';

const appName = 'My Inertia App';

createInertiaApp({
  title: (title) => `${title} - ${appName}`,

  resolve: (name) => {
    const pages = import.meta.glob('./Pages/**/*.svelte', { eager: true });
    return pages[`./Pages/${name}.svelte`];
  },

  setup({ el, App, props }) {
    // ✅ Initialize route helper with props
    // Automatically extracts baseUrl from props.initialPage.props.baseUrl
    initRouteHelper(props);

    // Optional: Apply additional configuration
    // import { configure } from '@tunbudi06/inertia-route-helper/init';
    // configure({
    //   trailingSlash: true,
    //   validateRoutes: import.meta.env.DEV
    // });

    new App({ target: el, props });
  },

  progress: {
    color: '#4B5563',
  },
});

/**
 * Alternative: Using Svelte $page Store
 *
 * You can also initialize from the $page store if needed:
 */

// import { page } from '@inertiajs/svelte';
// import { initRouteHelper } from '@tunbudi06/inertia-route-helper/init';
//
// // In a component or after app mount:
// page.subscribe(($page) => {
//   if ($page?.props?.baseUrl) {
//     initRouteHelper($page);
//   }
// });

/**
 * Manual Configuration for Testing
 */

// import { configure } from '@tunbudi06/inertia-route-helper/init';
//
// configure({
//   baseUrl: import.meta.env.VITE_APP_URL || 'http://localhost:8000',
//   trailingSlash: false,
//   validateRoutes: true
// });

/**
 * Environment-Specific Configuration
 */

// import { configure } from '@tunbudi06/inertia-route-helper/init';
//
// if (import.meta.env.PROD) {
//   configure({
//     baseUrl: 'https://production.com',
//     trailingSlash: true
//   });
// } else {
//   configure({
//     baseUrl: 'http://localhost:8000',
//     validateRoutes: true
//   });
// }
