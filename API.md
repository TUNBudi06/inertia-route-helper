﻿﻿# API Reference - @tunbudi06/inertia-route-helper

Complete API documentation for all functions and types.

---

## Table of Contents

- [Initialization](#initialization)
- [Core Route Functions](#core-route-functions)
- [Navigation Helpers](#navigation-helpers)
- [Configuration](#configuration)
- [Advanced Functions](#advanced-functions)
- [TypeScript Types](#typescript-types)

---

## Initialization

### `initRouteHelper(data)`

Initialize the route helper with Inertia props. Automatically extracts `baseUrl` from various data structures.

**Signature:**
```typescript
function initRouteHelper(data: any): void
```

**Parameters:**
- `data` - Can be props from `createInertiaApp`, Svelte `$page` store, or any object containing baseUrl

**Supports Multiple Structures:**
1. `props.initialPage.props.baseUrl` - React/Vue createInertiaApp props
2. `page.props.baseUrl` - Svelte $page store
3. `data.baseUrl` - Direct object

**⚠️ Important for Subfolder Deployments:**

If your app is deployed in a subfolder (e.g., `https://example.com/my-app`), you **must** share the `baseUrl` from Laravel:

```php
// app/Http/Middleware/HandleInertiaRequests.php
public function share(Request $request): array
{
    return array_merge(parent::share($request), [
        'baseUrl' => rtrim(config('app.url'), '/'),
    ]);
}
```

And ensure your `.env` includes the subpath:
```env
APP_URL=https://example.com/my-app
```

The helper cannot auto-detect subpaths from the browser URL. See [Troubleshooting](#troubleshooting) for details.

**Examples:**

```typescript
// React/Vue - Pass props from createInertiaApp
import { createInertiaApp } from '@inertiajs/react';
import { initRouteHelper } from '@tunbudi06/inertia-route-helper/init';

createInertiaApp({
  setup({ el, App, props }) {
    initRouteHelper(props);
    // ...
  }
});

// Svelte - Can use props or $page
import { page } from '@inertiajs/svelte';
import { initRouteHelper } from '@tunbudi06/inertia-route-helper/init';

initRouteHelper(props);  // or
initRouteHelper($page);
```

---

## Core Route Functions

### `route(routeDefinition)`

Transform a route definition to include absolute URL with base URL prepended.

**Signature:**
```typescript
function route<T extends AnyRoute>(routeDefinition: T): T
```

**Parameters:**
- `routeDefinition` - Route object with `url` property (from Ziggy/Wayfinder)

**Returns:**
- Route object with absolute URL and all other properties preserved

**Examples:**

```typescript
import { route } from '@tunbudi06/inertia-route-helper';

// Simple route
const dashboardRoute = route({ url: '/dashboard', method: 'GET' });
// { url: 'https://example.com/dashboard', method: 'GET' }

// With Ziggy
import { dashboard } from '@/routes';
const route = route(dashboard());
// { url: 'https://example.com/dashboard', ...ziggyProps }
```

> **🔄 Subfolder Deduplication**
> When `baseUrl` is a subfolder (e.g., `http://localhost/myapp`) and the route path already contains that subfolder, the helper automatically deduplicates:
>
> ```typescript
> // baseUrl = 'http://localhost/myapp'
> const route = route({ url: '/myapp/dashboard', method: 'GET' });
> // { url: 'http://localhost/myapp/dashboard', method: 'GET' }
> // NOT: 'http://localhost/myapp/myapp/dashboard'
> ```

---

### `routeUrl(routeDefinition)`

Get just the URL string from a route definition. Convenience wrapper around `route()`.

**Signature:**
```typescript
function routeUrl<T extends AnyRoute>(routeDefinition: T): string
```

**Parameters:**
- `routeDefinition` - Route object with `url` property

**Returns:**
- Absolute URL string

**Examples:**

```typescript
import { routeUrl } from '@tunbudi06/inertia-route-helper';
import { users, posts } from '@/routes';

// Simple URL
const url = routeUrl({ url: '/users' });
// 'https://example.com/users'

// With parameters
const userUrl = routeUrl(users.show({ id: 123 }));
// 'https://example.com/users/123'

// Complex route
const postUrl = routeUrl(posts.edit({ post: 10, comment: 5 }));
// 'https://example.com/posts/10/comments/5/edit'
```

---

### `buildRoute(path, options?)`

Build a complete URL with query parameters and fragment. Most flexible URL builder.

**Signature:**
```typescript
function buildRoute(
  path: string,
  options?: {
    query?: QueryParams;
    fragment?: string;
    absolute?: boolean;
  }
): string
```

**Parameters:**
- `path` - Base path (e.g., '/search' or '/users/123')
- `options` - Optional configuration object
  - `query?` - Query parameters object (supports arrays)
  - `fragment?` - Fragment/hash identifier (without #)
  - `absolute?` - Whether to include base URL (default: `true`)

**Returns:**
- Complete URL string

**Examples:**

```typescript
import { buildRoute } from '@tunbudi06/inertia-route-helper';

// Simple query parameters
const url1 = buildRoute('/search', {
  query: { q: 'test', page: 2 }
});
// 'https://example.com/search?q=test&page=2'

// With fragment
const url2 = buildRoute('/docs', {
  query: { section: 'api' },
  fragment: 'overview'
});
// 'https://example.com/docs?section=api#overview'

// Array parameters (repeated)
const url3 = buildRoute('/products', {
  query: {
    tags: ['new', 'featured', 'sale'],
    colors: ['red', 'blue']
  }
});
// 'https://example.com/products?tags[]=new&tags[]=featured&tags[]=sale&colors[]=red&colors[]=blue'

// Relative URL (no base URL)
const url4 = buildRoute('/api/users', { absolute: false });
// '/api/users'

// Null/undefined values are filtered out
const url5 = buildRoute('/search', {
  query: {
    q: 'test',
    page: null,      // Ignored
    filter: undefined // Ignored
  }
});
// 'https://example.com/search?q=test'
```

> **🔄 Subfolder Deduplication**
> `buildRoute()` automatically prevents URL doubling when the path already contains the subfolder:
>
> ```typescript
> // baseUrl = 'http://localhost/subfolder/public'
> const url = buildRoute('/subfolder/public/dashboard');
> // 'http://localhost/subfolder/public/dashboard'
> // NOT: 'http://localhost/subfolder/public/subfolder/public/dashboard'
>
> const url2 = buildRoute('/dashboard');
> // 'http://localhost/subfolder/public/dashboard' (normal behavior)
> ```

---

### `makeRoute(definition)`

Build route from a RouteDefinition object. Convenience wrapper for `buildRoute()` with object syntax.

**Signature:**
```typescript
function makeRoute(definition: RouteDefinition): string
```

**Parameters:**
- `definition` - Route definition object with `url`, optional `query`, and optional `fragment`

**Returns:**
- Complete URL string (always absolute)

**Examples:**

```typescript
import { makeRoute } from '@tunbudi06/inertia-route-helper';

// Simple route with query
const url1 = makeRoute({
  url: '/posts',
  query: { status: 'published' }
});
// 'https://example.com/posts?status=published'

// With query and fragment
const url2 = makeRoute({
  url: '/docs',
  query: { section: 'api' },
  fragment: 'authentication'
});
// 'https://example.com/docs?section=api#authentication'

// Complex filters
const url3 = makeRoute({
  url: '/products',
  query: {
    category: 'electronics',
    brands: ['apple', 'samsung'],
    minPrice: 100,
    maxPrice: 1000
  }
});
// 'https://example.com/products?category=electronics&brands[]=apple&brands[]=samsung&minPrice=100&maxPrice=1000'
```

---

## Navigation Helpers

### `isCurrentRoute(path, useHost?, exact?)`

Check if a path matches the current browser location. Useful for highlighting active navigation items.

**Signature:**
```typescript
function isCurrentRoute(path: string, useHost?: boolean, exact?: boolean): boolean
```

**Parameters:**
- `path` - Path to check (e.g., '/dashboard')
- `useHost?` - Whether to include the baseUrl or not (default: `false`)
- `exact?` - Whether to match exactly (default: `false` for partial match)

**Returns:**
- `true` if path matches current location, `false` otherwise
- Returns `false` in SSR context (no window)

**Examples:**

```typescript
import { isCurrentRoute } from '@tunbudi06/inertia-route-helper';

// Assuming current URL: https://example.com/dashboard/settings

// Partial match (default) - uses pathname only
isCurrentRoute('/dashboard');                      // true
isCurrentRoute('/dashboard/settings');             // true
isCurrentRoute('/users');                          // false

// Exact match - uses pathname only
isCurrentRoute('/dashboard', false, true);         // false (not exact)
isCurrentRoute('/dashboard/settings', false, true); // true (exact match)

// Using full URL with useHost=true
isCurrentRoute('/dashboard', true);                               // true
isCurrentRoute('/dashboard/settings', true);                      // true
isCurrentRoute('https://example.com/dashboard', true);            // true
isCurrentRoute('https://example.com/dashboard/settings', true, true); // true (exact)
isCurrentRoute('https://example.com/dashboard', true, true);      // false (not exact)

// Use in React component
function NavLink({ href, children }) {
  const isActive = isCurrentRoute(href);
  
  return (
    <a
      href={href}
      className={isActive ? 'active' : ''}
    >
      {children}
    </a>
  );
}

// Use in Vue component
<template>
  <a
    :href="href"
    :class="{ active: isCurrentRoute(href) }"
  >
    {{ label }}
  </a>
</template>

// Use in Svelte component
<a
  href={href}
  class:active={isCurrentRoute(href)}
>
  {label}
</a>
```

---

### `currentPath()`

Get the current pathname from browser location. SSR-safe.

**Signature:**
```typescript
function currentPath(): string
```

**Returns:**
- Current pathname (e.g., '/dashboard/settings')
- Returns empty string in SSR context

**Examples:**

```typescript
import { currentPath } from '@tunbudi06/inertia-route-helper';

const path = currentPath();
// '/dashboard/settings'

// Use for breadcrumbs
const segments = currentPath().split('/').filter(Boolean);
// ['dashboard', 'settings']

// Conditional rendering
if (currentPath().startsWith('/admin')) {
  // Show admin menu
}
```

---

### `currentUrl()`

Get the complete current URL from browser location. SSR-safe.

**Signature:**
```typescript
function currentUrl(): string
```

**Returns:**
- Full URL including protocol, host, path, query, and fragment
- Returns empty string in SSR context

**Examples:**

```typescript
import { currentUrl } from '@tunbudi06/inertia-route-helper';

const url = currentUrl();
// 'https://example.com/dashboard/settings?tab=profile#personal-info'

// Use for sharing
function shareCurrentPage() {
  const shareUrl = currentUrl();
  navigator.share({ url: shareUrl });
}

// Debug logging
console.log('Current URL:', currentUrl());
```

---

## Configuration

### `configure(options)`

Configure route helper behavior globally.

**Signature:**
```typescript
function configure(options: RouteHelperConfig): void
```

**Parameters:**
- `options` - Configuration object
  - `baseUrl?` - Override base URL
  - `trailingSlash?` - Add trailing slash to URLs (default: `false`)
  - `validateRoutes?` - Enable route validation (default: `false`)

**Examples:**

```typescript
import { configure } from '@tunbudi06/inertia-route-helper/init';

// Basic configuration
configure({
  baseUrl: 'https://custom-domain.com'
});

// With trailing slashes
configure({
  trailingSlash: true
});
// Now all URLs will have trailing slashes:
// 'https://example.com/dashboard/' instead of 'https://example.com/dashboard'

// Full configuration
configure({
  baseUrl: 'https://api.example.com',
  trailingSlash: false,
  validateRoutes: false
});

// Update specific option
configure({ trailingSlash: true });
// Other options remain unchanged
```

---

## Advanced Functions

### `setBaseUrl(url)`

Manually set the base URL. Useful for testing or advanced use cases.

**Signature:**
```typescript
function setBaseUrl(url: string): void
```

**Parameters:**
- `url` - Base URL string (trailing slash will be removed automatically)

**Examples:**

```typescript
import { setBaseUrl } from '@tunbudi06/inertia-route-helper';

// Set custom base URL
setBaseUrl('https://example.com');

// For testing
beforeEach(() => {
  setBaseUrl('https://test.example.com');
});

// Subfolder deployment
setBaseUrl('https://example.com/my-app');
```

---

### `getBaseUrl()`

Get the current base URL.

**Signature:**
```typescript
function getBaseUrl(): string
```

**Returns:**
- Current base URL string
- Auto-detects from `window.location` if not set

**Examples:**

```typescript
import { getBaseUrl } from '@tunbudi06/inertia-route-helper';

const baseUrl = getBaseUrl();
// 'https://example.com'

// Check configuration
console.log('Using base URL:', getBaseUrl());

// Build custom URLs
const apiUrl = `${getBaseUrl()}/api/v1`;
```

---

## TypeScript Types

### `AnyRoute`

Base type for route definitions.

```typescript
type AnyRoute = {
  url: string;
  [key: string]: any;
}
```

---

### `RouteDefinition`

Complete route definition with optional query and fragment.

```typescript
type RouteDefinition = {
  url: string;
  query?: QueryParams;
  fragment?: string;
  [key: string]: any;
}
```

---

### `QueryParams`

Query parameters object type.

```typescript
type QueryParams = {
  [key: string]: string | number | boolean | (string | number)[] | null | undefined;
}
```

**Examples:**

```typescript
// Simple params
const params1: QueryParams = {
  q: 'search term',
  page: 2,
  active: true
};

// Array params
const params2: QueryParams = {
  tags: ['laravel', 'vue', 'inertia'],
  ids: [1, 2, 3]
};

// Mixed with null (filtered out)
const params3: QueryParams = {
  search: 'test',
  filter: null,      // Will be ignored
  sort: undefined    // Will be ignored
};
```

---

### `RouteParams`

Route parameters type (for Ziggy/Wayfinder compatibility).

```typescript
type RouteParams = Record<string, any>
```

---

### `RouteHelperConfig`

Configuration options type.

```typescript
type RouteHelperConfig = {
  baseUrl?: string;
  trailingSlash?: boolean;
  validateRoutes?: boolean;
}
```

---

## Complete Import Reference

```typescript
// Route helper functions (main import)
import {
  route,
  routeUrl,
  buildRoute,
  makeRoute,
  isCurrentRoute,
  currentPath,
  currentUrl
} from '@tunbudi06/inertia-route-helper';

// Initialization functions (/init import)
import {
  initRouteHelper,
  configure,
  setBaseUrl,
  getBaseUrl
} from '@tunbudi06/inertia-route-helper/init';

// Types
import type {
  AnyRoute,
  RouteDefinition,
  QueryParams,
  RouteParams,
  RouteHelperConfig
} from '@tunbudi06/inertia-route-helper';
```

---

## SSR Safety

All navigation helper functions are SSR-safe:

- `isCurrentRoute()` - Returns `false` in SSR context
- `currentPath()` - Returns empty string in SSR context
- `currentUrl()` - Returns empty string in SSR context

Core route building functions work in both SSR and client contexts.

---

## Troubleshooting

### BaseUrl Not Including Subpath

**Problem:** After calling `initRouteHelper(props)`, URLs don't include your application's subpath (e.g., getting `/dashboard` instead of `https://example.com/my-app/dashboard`).

**Cause:** The route helper requires explicit baseUrl configuration. It does not auto-detect from the browser because it's impossible to distinguish where the subpath ends and the route begins.

**Solution:**

1. **Ensure Laravel shares the correct baseUrl** (Recommended):

```php
// app/Http/Middleware/HandleInertiaRequests.php
public function share(Request $request): array
{
    return array_merge(parent::share($request), [
        'baseUrl' => rtrim(config('app.url'), '/'),
    ]);
}
```

2. **Set your APP_URL with the subpath in `.env`**:

```env
APP_URL=https://example.com/my-app
```

**Not just:**
```env
APP_URL=https://example.com
```

3. **Alternative - Manual configuration** (if you can't modify Laravel):

```typescript
import { configure } from '@tunbudi06/inertia-route-helper/init';

configure({
  baseUrl: 'https://example.com/my-app'
});
```

**Verify it's working:**

```typescript
import { getBaseUrl } from '@tunbudi06/inertia-route-helper/init';

console.log('Current baseUrl:', getBaseUrl());
// Should show: 'https://example.com/my-app'
```

---

### How BaseUrl Detection Works

The route helper requires explicit configuration of the base URL:

**From Props (Required)**

When you call `initRouteHelper(props)`, it extracts `baseUrl` from:
1. `props.initialPage.props.baseUrl` (React/Vue with createInertiaApp)
2. `page.props.baseUrl` (Svelte $page store)
3. `props.baseUrl` (direct object)

**From Manual Configuration**

Alternatively, you can set it manually using `configure()` or `setBaseUrl()`:

```typescript
import { configure } from '@tunbudi06/inertia-route-helper/init';

configure({
  baseUrl: 'https://example.com/my-app'
});
```

**If BaseUrl is Not Set**

If no `baseUrl` is configured, route functions will return relative URLs (e.g., `/dashboard` instead of `https://example.com/dashboard`).

**Best Practice:** Always pass `baseUrl` from Laravel via Inertia props to ensure correct behavior, especially for subfolder deployments.


