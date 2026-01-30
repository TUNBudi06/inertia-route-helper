import { describe, it, expect, beforeEach, vi, afterEach } from 'vitest';
import { getBaseUrl, setBaseUrl, configure, getConfig, initRouteHelper } from './store';

// Mock the router
vi.mock('@inertiajs/core', () => ({
  router: {
    on: vi.fn(),
  },
}));

describe('store', () => {
  beforeEach(() => {
    // Reset state before each test
    setBaseUrl('');
    configure({ trailingSlash: false, validateRoutes: false });
  });

  afterEach(() => {
    // Clean up after each test
    setBaseUrl('');
  });

  describe('initRouteHelper', () => {
    it('should initialize base URL from props.initialPage.props.baseUrl', () => {
      const props = {
        initialPage: {
          props: {
            baseUrl: 'https://from-inertia.com',
          },
        },
      };

      initRouteHelper(props);
      expect(getBaseUrl()).toBe('https://from-inertia.com');
    });

    it('should initialize from page.props.baseUrl (Svelte $page)', () => {
      const page = {
        props: {
          baseUrl: 'https://from-svelte-page.com',
        },
      };

      initRouteHelper(page);
      expect(getBaseUrl()).toBe('https://from-svelte-page.com');
    });

    it('should initialize from direct baseUrl property', () => {
      const data = {
        baseUrl: 'https://direct.com',
      };

      initRouteHelper(data);
      expect(getBaseUrl()).toBe('https://direct.com');
    });

    it('should prioritize props.initialPage.props.baseUrl over others', () => {
      const props = {
        initialPage: {
          props: {
            baseUrl: 'https://priority.com',
          },
        },
        props: {
          baseUrl: 'https://should-not-use.com',
        },
        baseUrl: 'https://also-not-use.com',
      };

      initRouteHelper(props);
      expect(getBaseUrl()).toBe('https://priority.com');
    });

    it('should remove trailing slash from initialized base URL', () => {
      const props = {
        initialPage: {
          props: {
            baseUrl: 'https://example.com/',
          },
        },
      };

      initRouteHelper(props);
      expect(getBaseUrl()).toBe('https://example.com');
    });

    it('should not crash if props is missing', () => {
      initRouteHelper({});
      // Should remain empty or use fallback
      const url = getBaseUrl();
      expect(url).toBeDefined();
    });

    it('should not crash if props is null', () => {
      initRouteHelper(null);
      const url = getBaseUrl();
      expect(url).toBeDefined();
    });

    it('should not crash if props is undefined', () => {
      initRouteHelper(undefined);
      const url = getBaseUrl();
      expect(url).toBeDefined();
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
