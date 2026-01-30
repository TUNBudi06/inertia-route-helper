import { describe, it, expect, beforeEach, vi } from 'vitest';
import { getBaseUrl, setBaseUrl, configure, getConfig } from './store';

// Mock the router
vi.mock('@inertiajs/core', () => ({
  router: {
    on: vi.fn(),
  },
}));

describe('store', () => {
  beforeEach(() => {
    // Reset base URL before each test
    setBaseUrl('');
  });

  describe('getBaseUrl', () => {
    it('should return empty string by default', () => {
      expect(getBaseUrl()).toBe('');
    });

    it('should return the set base URL', () => {
      setBaseUrl('https://example.com');
      expect(getBaseUrl()).toBe('https://example.com');
    });
  });

  describe('setBaseUrl', () => {
    it('should set the base URL', () => {
      setBaseUrl('https://example.com');
      expect(getBaseUrl()).toBe('https://example.com');
    });

    it('should remove trailing slash from base URL', () => {
      setBaseUrl('https://example.com/');
      expect(getBaseUrl()).toBe('https://example.com');
    });

    it('should handle base URL with subfolder', () => {
      setBaseUrl('https://example.com/subfolder/');
      expect(getBaseUrl()).toBe('https://example.com/subfolder');
    });

    it('should handle multiple trailing slashes', () => {
      setBaseUrl('https://example.com///');
      expect(getBaseUrl()).toBe('https://example.com//');
    });
  });

  describe('configure', () => {
    beforeEach(() => {
      // Reset config
      configure({
        trailingSlash: false,
        validateRoutes: false,
      });
    });

    it('should set base URL from config', () => {
      configure({ baseUrl: 'https://test.com' });
      expect(getBaseUrl()).toBe('https://test.com');
    });

    it('should merge configuration options', () => {
      configure({ trailingSlash: true });
      const config = getConfig();
      expect(config.trailingSlash).toBe(true);
    });

    it('should update only specified config options', () => {
      configure({ trailingSlash: true });
      configure({ validateRoutes: true });
      const config = getConfig();
      expect(config.trailingSlash).toBe(true);
      expect(config.validateRoutes).toBe(true);
    });
  });

  describe('getConfig', () => {
    beforeEach(() => {
      // Reset to default config before each test
      configure({
        trailingSlash: false,
        validateRoutes: false,
      });
      setBaseUrl('');
    });

    it('should return default config', () => {
      const config = getConfig();
      expect(config.trailingSlash).toBe(false);
      expect(config.validateRoutes).toBe(false);
    });

    it('should return updated config', () => {
      configure({
        baseUrl: 'https://example.com',
        trailingSlash: true,
        validateRoutes: true,
      });
      const config = getConfig();
      expect(config.trailingSlash).toBe(true);
      expect(config.validateRoutes).toBe(true);
    });
  });
});
