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
