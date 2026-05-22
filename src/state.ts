import type { RouteHelperConfig } from './types';

// ============================================================================
// STATE MANAGEMENT
// ============================================================================

/** Base URL for all routes (e.g., 'https://example.com' or 'https://example.com/subfolder') */
let baseUrl = '';

/** Configuration options for route helper behavior */
let config: RouteHelperConfig = {
  trailingSlash: false,
  validateRoutes: false,
};

// ============================================================================
// STATE GETTERS
// ============================================================================

/**
 * Get the current base URL
 * Returns empty string if not set via initRouteHelper() or setBaseUrl()
 * @returns The base URL string
 */
export function getBaseUrl(): string {

  return baseUrl;
}

/**
 * Get current configuration
 * @returns Current route helper configuration
 */
export function getConfig(): RouteHelperConfig {
  return config;
}

// ============================================================================
// STATE SETTERS
// ============================================================================

/**
 * Set base URL directly
 * @param url - Base URL to set
 */
export function setBaseUrl(url: string): void {
  baseUrl = url.replace(/\/$/, '');
}

/**
 * Get the path portion of the base URL.
 * For 'http://localhost/subfolder/public' returns '/subfolder/public'.
 * For 'http://localhost' returns ''.
 */
function getBasePathname(): string {
  if (!baseUrl) return '';
  try {
    const url = new URL(baseUrl);
    return url.pathname.replace(/\/$/, '');
  } catch {
    return '';
  }
}

/**
 * Resolve a route path against the base URL, deduplicating the base path
 * if it is already present in the route path.
 *
 * Prevents URL doubling when routes already include the subfolder:
 * @example
 * baseUrl = 'http://localhost/myapp', path = '/myapp/dashboard'
 * resolveBasePath(path) -> 'http://localhost/myapp/dashboard'
 *
 * @example
 * baseUrl = 'http://localhost/myapp', path = '/dashboard'
 * resolveBasePath(path) -> 'http://localhost/myapp/dashboard'
 *
 * @param path - Route path to resolve
 * @returns Full absolute URL with deduplication applied
 */
export function resolveBasePath(path: string): string {
  if (!baseUrl) return path;

  const basePath = getBasePathname();

  // No base path (origin-only URL like 'http://localhost')
  if (!basePath) {
    return baseUrl + path;
  }

  // Path already includes base path (followed by / or exact match)
  // This prevents duplication like /myapp/myapp/dashboard
  if (path === basePath || path.startsWith(basePath + '/')) {
    const origin = baseUrl.slice(0, -basePath.length);
    return origin + path;
  }

  // Normal case: path doesn't include base path
  return baseUrl + path;
}

/**
 * Set configuration
 * @param newConfig - Configuration to merge
 */
export function setConfig(newConfig: RouteHelperConfig): void {
  config = { ...config, ...newConfig };
}
