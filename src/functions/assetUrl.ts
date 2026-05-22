import type { BuildRouteOptions } from '../types';
import { buildRoute } from './buildRoute';

// Regex to detect absolute URLs:
//   - http://, https://, ftp://, etc. (scheme + ://)
//   - //example.com (protocol-relative)
//   - data:, blob:, mailto:, tel:, etc. (scheme + : but no //)
const ABSOLUTE_URL_RE = /^(?:[a-zA-Z][a-zA-Z0-9+.-]*:(?:\/\/|[^\/])|[a-zA-Z][a-zA-Z0-9+.-]*:|\/\/)/;

/**
 * Build asset URL with automatic path normalization.
 *
 * - If the path is a **relative path** (e.g., `/images/logo.png`, `css/style.css`),
 *   it prepends the base URL automatically.
 * - If the path is already an **absolute URL** (e.g., `https://cdn.example.com/image.png`,
 *   `//cdn.example.com/image.png`, `data:image/png;base64,...`),
 *   it passes through as-is without modification.
 *
 * @param assetPath - Path or URL to asset
 * @param options - Optional build route options
 * @returns Complete asset URL string
 *
 * @example
 * ```typescript
 * // Relative paths get baseUrl prepended
 * assetUrl('/images/logo.png');
 * // Returns: 'https://example.com/images/logo.png'
 *
 * assetUrl('css/styles.css');
 * // Returns: 'https://example.com/css/styles.css'
 *
 * // Absolute URLs pass through as-is
 * assetUrl('https://cdn.example.com/banner.png');
 * // Returns: 'https://cdn.example.com/banner.png'
 *
 * assetUrl('//cdn.example.com/script.js');
 * // Returns: '//cdn.example.com/script.js'
 *
 * assetUrl('data:image/svg+xml;utf8,<svg...></svg>');
 * // Returns: 'data:image/svg+xml;utf8,<svg...></svg>'
 * ```
 */
export function assetUrl(assetPath: string, options?: BuildRouteOptions): string {
  // If the path is already an absolute URL, pass it through as-is
  if (ABSOLUTE_URL_RE.test(assetPath)) {
    return assetPath;
  }

  // Normalize relative path: strip leading slashes, then join with /
  if (assetPath.startsWith('/') || assetPath.startsWith('\\')) {
    assetPath = assetPath.substring(1);
  }
  return buildRoute('/' + assetPath, options);
}
