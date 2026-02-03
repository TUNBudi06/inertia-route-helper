/**
 * React Application Setup Example
 *
 * This file shows how to properly initialize the Inertia Route Helper
 * in a React + Inertia.js application using the new /init import path.
 */

import { createRoot } from 'react-dom/client';
import { createInertiaApp } from '@inertiajs/react';
import { initRouteHelper } from '@tunbudi06/inertia-route-helper/init';

// Optional: Configure additional options
// import { configure } from '@tunbudi06/inertia-route-helper/init';

const appName = 'My Inertia App';

createInertiaApp({
  title: (title) => `${title} - ${appName}`,

  resolve: (name) => {
    const pages = import.meta.glob('./Pages/**/*.tsx', { eager: true });
    return pages[`./Pages/${name}.tsx`];
  },

  setup({ el, App, props }) {
    // ✅ Initialize route helper with props
    // Automatically extracts baseUrl from props.initialPage.props.baseUrl
    initRouteHelper(props);

    // Optional: Apply additional configuration
    // configure({
    //   trailingSlash: true,
    //   validateRoutes: import.meta.env.DEV
    // });

    const root = createRoot(el);
    root.render(<App {...props} />);
  },

  progress: {
    color: '#4B5563',
  },
});

/**
 * Alternative: Manual Configuration
 *
 * If you need to set baseUrl manually (e.g., for testing):
 */

// import { configure } from '@tunbudi06/inertia-route-helper/init';
//
// configure({
//   baseUrl: import.meta.env.VITE_APP_URL || 'http://localhost:8000',
//   trailingSlash: false,
//   validateRoutes: true
// });

/**
 * Environment-Specific Setup
 */

// const baseUrl = import.meta.env.PROD
//   ? 'https://production.com'
//   : 'http://localhost:8000';
//
// configure({ baseUrl });
