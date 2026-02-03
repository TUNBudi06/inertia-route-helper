import type { RouteHelperConfig } from '../types';
import { setBaseUrl, setConfig } from '../state';

/**
 * Configure route helper behavior globally
 *
 * @param options - Configuration options
 *
 * @example
 * ```typescript
 * configure({
 *   baseUrl: 'https://example.com',
 *   trailingSlash: true,
 *   validateRoutes: true
 * });
 * ```
 */
export function configure(options: RouteHelperConfig): void {
  setConfig(options);

  // Update baseUrl if provided
  if (options.baseUrl) {
    setBaseUrl(options.baseUrl);
  }
}
