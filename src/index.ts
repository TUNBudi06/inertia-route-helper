import type { AnyRoute, RouteDefinition, QueryParams, RouteHelperConfig } from './types';
import { getBaseUrl, getConfig, configure as configureStore } from './store';

// ============================================================================
// HELPER FUNCTIONS
// ============================================================================

/**
 * Build URL query string from parameters object
 * Handles arrays as repeated parameters (e.g., tags[]=value1&tags[]=value2)
 * Filters out null and undefined values
 *
 * @param params - Query parameters object
 * @returns Query string with leading ? or empty string
 */
function buildQueryString(params: QueryParams): string {
  const searchParams = new URLSearchParams();

  Object.entries(params).forEach(([key, value]) => {
    // Skip null and undefined values
    if (value == null) return;

    // Handle arrays - append each value with [] suffix
    if (Array.isArray(value)) {
      value.forEach(item => searchParams.append(`${key}[]`, String(item)));
    } else {
      searchParams.append(key, String(value));
    }
  });

  const queryString = searchParams.toString();
  return queryString ? `?${queryString}` : '';
}

// ============================================================================
// CONFIGURATION
// ============================================================================

/**
 * Configure route helper behavior globally
 * @param options - Configuration options
 */
export function configure(options: RouteHelperConfig): void {
  configureStore(options);
}

// ============================================================================
// CORE ROUTE FUNCTIONS
// ============================================================================

/**
 * Transform a route definition to include absolute URL
 * Automatically prepends base URL and handles trailing slashes
 *
 * @param routeDefinition - Route object with url property
 * @returns Route object with absolute URL
 *
 * @example
 * ```typescript
 * const dashboardRoute = route({ url: '/dashboard', method: 'GET' });
 * // Returns: { url: 'https://example.com/dashboard', method: 'GET' }
 * ```
 */
export function route<T extends AnyRoute>(routeDefinition: T): T {
  const base = getBaseUrl() || (typeof window !== 'undefined' ? window.location.origin : '');
  const cfg = getConfig();

  let url = base + routeDefinition.url;

  // Add trailing slash if configured
  if (cfg.trailingSlash && !url.endsWith('/')) {
    url += '/';
  }

  return {
    ...routeDefinition,
    url,
  };
}

/**
 * Get just the URL string from a route definition
 * Convenience wrapper around route()
 *
 * @param routeDefinition - Route object
 * @returns Absolute URL string
 *
 * @example
 * ```typescript
 * const url = routeUrl({ url: '/users/123' });
 * // Returns: 'https://example.com/users/123'
 * ```
 */
export function routeUrl<T extends AnyRoute>(routeDefinition: T): string {
  return route(routeDefinition).url;
}

/**
 * Build a complete URL with query parameters and fragment
 * Flexible URL builder with full control over all URL components
 *
 * @param path - Base path (e.g., '/search' or '/users/123')
 * @param options - Optional configuration
 * @param options.query - Query parameters object
 * @param options.fragment - Fragment/hash identifier
 * @param options.absolute - Whether to include base URL (default: true)
 * @returns Complete URL string
 *
 * @example
 * ```typescript
 * // With query parameters
 * buildRoute('/search', {
 *   query: { q: 'test', page: 2 },
 *   fragment: 'results'
 * });
 * // Returns: 'https://example.com/search?q=test&page=2#results'
 *
 * // Relative URL
 * buildRoute('/api/users', { absolute: false });
 * // Returns: '/api/users'
 * ```
 */
export function buildRoute(
  path: string,
  options?: {
    query?: QueryParams;
    fragment?: string;
    absolute?: boolean;
  }
): string {
  const { query, fragment, absolute = true } = options || {};

  let url = path;

  // Prepend base URL if absolute
  if (absolute) {
    const base = getBaseUrl() || (typeof window !== 'undefined' ? window.location.origin : '');
    url = base + url;
  }

  // Append query parameters
  if (query) {
    url += buildQueryString(query);
  }

  // Append fragment/hash
  if (fragment) {
    url += `#${fragment}`;
  }

  // Add trailing slash if configured (but not with query/fragment)
  const cfg = getConfig();
  if (cfg.trailingSlash && !url.includes('?') && !url.includes('#') && !url.endsWith('/')) {
    url += '/';
  }

  return url;
}

/**
 * Build route from a RouteDefinition object
 * Convenience wrapper for buildRoute with object syntax
 *
 * @param definition - Route definition with url, query, and fragment
 * @returns Complete URL string
 *
 * @example
 * ```typescript
 * makeRoute({
 *   url: '/posts',
 *   query: { status: 'published' },
 *   fragment: 'list'
 * });
 * // Returns: 'https://example.com/posts?status=published#list'
 * ```
 */
export function makeRoute(definition: RouteDefinition): string {
  return buildRoute(definition.url, {
    query: definition.query,
    fragment: definition.fragment,
    absolute: true,
  });
}

// ============================================================================
// NAVIGATION HELPERS
// ============================================================================

/**
 * Check if a path matches the current browser location
 * Useful for highlighting active navigation items
 *
 * @param path - Path to check (e.g., '/dashboard')
 * @param useHost - Whether to include the baseUrl or not (default: false)
 * @param exact - Whether to match exactly (default: false for partial match)
 * @returns True if path matches current location
 *
 * @example
 * ```typescript
 * // Current URL: https://example.com/dashboard/settings
 *
 * isCurrentRoute('/dashboard');        // true (partial match)
 * isCurrentRoute('/dashboard', false, true);  // false (not exact)
 * isCurrentRoute('/dashboard/settings', false, true); // true (exact match)
 * isCurrentRoute('/dashboard', true); // true
 * isCurrentRoute('/dashboard/settings', true); // true
 * isCurrentRoute('https://example.com/dashboard', true); // true
 * isCurrentRoute('https://example.com/dashboard/settings', true, true); // true
 * isCurrentRoute('https://example.com/dashboard', true, true); // false
 * ```
 */
export function isCurrentRoute(path: string, useHost: boolean = false, exact: boolean = false): boolean {
  if (typeof window === 'undefined') return false;

  const currentPath = useHost ? window.location.href : window.location.pathname;

  return exact ? currentPath === path : currentPath.startsWith(path);
}

/**
 * Get the current pathname from browser location
 * SSR-safe (returns empty string on server)
 *
 * @returns Current pathname (e.g., '/dashboard/settings')
 */
export function currentPath(): string {
  return typeof window !== 'undefined' ? window.location.pathname : '';
}

/**
 * Get the complete current URL from browser location
 * SSR-safe (returns empty string on server)
 *
 * @returns Full URL including protocol, host, path, query, and fragment
 */
export function currentUrl(): string {
  return typeof window !== 'undefined' ? window.location.href : '';
}

// ============================================================================
// EXPORTS
// ============================================================================

// Re-export types for convenience
export type { AnyRoute, RouteDefinition, QueryParams, RouteParams, RouteHelperConfig } from './types';

// Re-export initialization and helper functions
export { initRouteHelper, setBaseUrl, getBaseUrl } from './store';
