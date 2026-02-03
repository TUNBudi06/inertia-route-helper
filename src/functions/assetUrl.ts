import type { BuildRouteOptions } from '../types';
import { buildRoute } from './buildRoute';

/**
 * Build asset URL with automatic path normalization
 * Removes leading slashes and builds absolute URL
 *
 * @param assetPath - Path to asset (e.g., 'images/logo.png' or '/images/logo.png')
 * @param options - Optional build route options
 * @returns Complete asset URL string
 *
 * @example
 * ```typescript
 * assetUrl('/images/logo.png');
 * // Returns: 'https://example.com/images/logo.png'
 *
 * assetUrl('css/styles.css');
 * // Returns: 'https://example.com/css/styles.css'
 * ```
 */
export function assetUrl(assetPath: string, options?: BuildRouteOptions): string {
  if (assetPath.startsWith('/') || assetPath.startsWith('\\')) {
    assetPath = assetPath.substring(1);
  }
  return buildRoute('/' + assetPath, options);
}
