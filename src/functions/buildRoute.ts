import type { BuildRouteOptions } from '../types';
import { getConfig, resolveBasePath } from '../state';
import { buildQueryString } from './buildQueryString';

/**
 * Build a complete URL with query parameters and fragment
 * Flexible URL builder with full control over all URL components.
 * Automatically deduplicates subfolder paths to prevent URL doubling.
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
 *
 * // Subfolder path deduplication (when route already contains the subfolder):
 * buildRoute('/subfolder/public/dashboard');
 * // Returns: 'http://localhost/subfolder/public/dashboard' (not duplicated)
 * ```
 */
export function buildRoute(
  path: string,
  options?: BuildRouteOptions
): string {
  const { query, fragment, absolute = true } = options || {};

  let url = path;

  // Prepend base URL if absolute (with subfolder path deduplication)
  if (absolute) {
    url = resolveBasePath(url);
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
