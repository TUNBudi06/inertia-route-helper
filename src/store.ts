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
// HELPER FUNCTIONS
// ============================================================================

/**
 * Auto-detect base URL from browser's current location
 * Falls back to this when baseUrl is not explicitly set
 * @returns Full base URL with protocol, hostname, and port
 */
function autoDetectBaseUrl(): string {
  if (typeof window === 'undefined') return '';

  const { protocol, hostname, port } = window.location;
  const portPart = port && port !== '80' && port !== '443' ? `:${port}` : '';

  return `${protocol}//${hostname}${portPart}`;
}

// ============================================================================
// PUBLIC API
// ============================================================================

/**
 * Get the current base URL
 * Auto-detects from window.location if not set
 * @returns The base URL string
 */
export function getBaseUrl(): string {
  if (baseUrl) return baseUrl;

  // Auto-detect from browser if not set
  if (typeof window !== 'undefined') {
    baseUrl = autoDetectBaseUrl();
  }

  return baseUrl;
}

/**
 * Initialize route helper with Inertia props
 * Automatically extracts baseUrl from various data structures:
 * - props.initialPage.props.baseUrl (from createInertiaApp setup)
 * - page.props.baseUrl (from Svelte $page store)
 * - props.baseUrl (direct props)
 *
 * @param data - Can be props object, page object, or Svelte $page store
 *
 * @example
 * ```typescript
 * // React/Vue: Pass props from createInertiaApp
 * createInertiaApp({
 *   setup({ el, App, props }) {
 *     initRouteHelper(props);
 *   }
 * });
 *
 * // Svelte: Can pass props or use $page
 * import { page } from '@inertiajs/svelte';
 * initRouteHelper(props); // or initRouteHelper($page)
 * ```
 */
export function initRouteHelper(data: any): void {
  if (!data) return;

  let url: string | null = null;

  // Try to extract baseUrl from different structures
  // 1. Try: props.initialPage.props.baseUrl (createInertiaApp props)
  url = data?.initialPage?.props?.baseUrl;

  // 2. Try: page.props.baseUrl (Svelte $page store or direct page object)
  if (!url) {
    url = data?.props?.baseUrl;
  }

  // 3. Try: direct baseUrl (if passed directly)
  if (!url) {
    url = data?.baseUrl;
  }

  // Set baseUrl if found and valid
  if (url && typeof url === 'string') {
    baseUrl = url.replace(/\/$/, '');
  }
}

/**
 * Configure route helper behavior
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
  config = { ...config, ...options };

  // Update baseUrl if provided
  if (options.baseUrl) {
    baseUrl = options.baseUrl.replace(/\/$/, '');
  }
}

/**
 * Get current configuration
 * @returns Current route helper configuration
 */
export function getConfig(): RouteHelperConfig {
  return config;
}

/**
 * Set base URL directly (for testing or advanced use cases)
 * @param url - Base URL to set
 * @internal
 */
export function setBaseUrl(url: string): void {
  baseUrl = url.replace(/\/$/, '');
}


