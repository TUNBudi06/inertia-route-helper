/**
 * Inertia Route Helper
 * 
 * Powerful routing helper for Inertia.js v2 applications with support for
 * absolute URLs, subfolder deployments, query parameters, and route validation.
 * 
 * @module inertia-route-helper
 * 
 * @example
 * ```typescript
 * // Import route functions
 * import { route, buildRoute, isCurrentRoute } from '@tunbudi06/inertia-route-helper';
 * 
 * // Use in your components
 * const dashboardUrl = route({ url: '/dashboard' }).url;
 * const searchUrl = buildRoute('/search', { query: { q: 'test' } });
 * const isActive = isCurrentRoute('/dashboard');
 * ```
 */
// Re-export core route functions
export { route } from './functions/route';
export { routeUrl } from './functions/routeUrl';
export { buildRoute } from './functions/buildRoute';
export { makeRoute } from './functions/makeRoute';
// Re-export navigation helpers
export { isCurrentRoute } from './functions/isCurrentRoute';
export { currentPath } from './functions/currentPath';
export { currentUrl } from './functions/currentUrl';
// Re-export utility functions
export { assetUrl } from './functions/assetUrl';
// Re-export types for convenience
export type { 
  AnyRoute, 
  RouteDefinition, 
  QueryParams, 
  RouteParams, 
  RouteHelperConfig,
  BuildRouteOptions 
} from './types';
