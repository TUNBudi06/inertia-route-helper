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
 * Set configuration
 * @param newConfig - Configuration to merge
 */
export function setConfig(newConfig: RouteHelperConfig): void {
  config = { ...config, ...newConfig };
}
