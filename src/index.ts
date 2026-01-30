import type { AnyRoute, RouteDefinition, QueryParams, RouteHelperConfig } from './types';
import { getBaseUrl, getConfig, configure as configureStore } from './store';

/**
 * Build query string from parameters
 */
function buildQueryString(params: QueryParams): string {
  const searchParams = new URLSearchParams();

  Object.entries(params).forEach(([key, value]) => {
    if (value === null || value === undefined) return;

    if (Array.isArray(value)) {
      value.forEach(v => searchParams.append(`${key}[]`, String(v)));
    } else {
      searchParams.append(key, String(value));
    }
  });

  const queryString = searchParams.toString();
  return queryString ? `?${queryString}` : '';
}

/**
 * Configure the route helper
 */
export function configure(options: RouteHelperConfig): void {
  configureStore(options);
}

/**
 * Get the full absolute URL for a route
 */
export function route<T extends AnyRoute>(routeDefinition: T): T {
  const base = getBaseUrl() || (typeof window !== 'undefined' ? window.location.origin : '');
  const config = getConfig();

  let url = base + routeDefinition.url;

  // Add trailing slash if configured
  if (config.trailingSlash && !url.endsWith('/')) {
    url += '/';
  }

  return {
    ...routeDefinition,
    url,
  };
}

/**
 * Get just the URL string for a route
 */
export function routeUrl<T extends AnyRoute>(routeDefinition: T): string {
  return route(routeDefinition).url;
}

/**
 * Build a complete URL with query parameters and fragment
 */
export function buildRoute(path: string, options?: {
  query?: QueryParams;
  fragment?: string;
  absolute?: boolean;
}): string {
  const { query, fragment, absolute = true } = options || {};

  let url = path;

  // Add base URL if absolute
  if (absolute) {
    const base = getBaseUrl() || (typeof window !== 'undefined' ? window.location.origin : '');
    url = base + url;
  }

  // Add query parameters
  if (query) {
    url += buildQueryString(query);
  }

  // Add fragment
  if (fragment) {
    url += `#${fragment}`;
  }

  // Add trailing slash if configured
  const config = getConfig();
  if (config.trailingSlash && !url.includes('?') && !url.includes('#') && !url.endsWith('/')) {
    url += '/';
  }

  return url;
}

/**
 * Enhanced route builder with full feature support
 */
export function makeRoute(definition: RouteDefinition): string {
  return buildRoute(definition.url, {
    query: definition.query,
    fragment: definition.fragment,
    absolute: true,
  });
}

/**
 * Check if a route matches the current path
 */
export function isCurrentRoute(path: string, exact: boolean = false): boolean {
  if (typeof window === 'undefined') return false;

  const currentPath = window.location.pathname;

  if (exact) {
    return currentPath === path;
  }

  return currentPath.startsWith(path);
}

/**
 * Get the current route path (relative)
 */
export function currentPath(): string {
  if (typeof window === 'undefined') return '';
  return window.location.pathname;
}

/**
 * Get the current full URL
 */
export function currentUrl(): string {
  if (typeof window === 'undefined') return '';
  return window.location.href;
}

// Re-export types
export type { AnyRoute, RouteDefinition, QueryParams, RouteParams, RouteHelperConfig } from './types';
export { getBaseUrl, setBaseUrl } from './store';
