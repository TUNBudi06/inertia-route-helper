/**
 * Initialization and Configuration Module
 *
 * This module provides functions for initializing and configuring the route helper.
 * Import from '/init' when setting up your application.
 *
 * @module init
 *
 * @example
 * ```typescript
 * // Import initialization functions
 * import { initRouteHelper, configure, setBaseUrl } from '@tunbudi06/inertia-route-helper/init';
 *
 * // Initialize with Inertia props
 * createInertiaApp({
 *   setup({ el, App, props }) {
 *     initRouteHelper(props);
 *     // ...
 *   }
 * });
 *
 * // Or configure manually
 * configure({
 *   baseUrl: 'https://example.com',
 *   trailingSlash: true,
 *   validateRoutes: true
 * });
 * ```
 */

// Re-export initialization and configuration functions
export { initRouteHelper } from './init-functions/initRouteHelper';
export { configure } from './init-functions/configure';

// Re-export state functions
export { setBaseUrl, getBaseUrl, getConfig } from './state';

// Re-export types needed for configuration
export type { RouteHelperConfig } from './types';
