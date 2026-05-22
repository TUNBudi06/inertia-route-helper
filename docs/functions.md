# Function Reference

> Exported from `@tunbudi06/inertia-route-helper`

---

## `route(routeDefinition)`

Transforms a route definition into an absolute URL object.

```typescript
function route<T extends AnyRoute>(routeDefinition: T): T
```

- **Input**: Object with a `url` string property (and any other properties preserved)
- **Output**: Same object with `url` rewritten to absolute URL

**Deduplication**: If the route's `url` already contains the base URL's subfolder path, the duplicate is removed.

**Example:**
```typescript
route({ url: '/dashboard', method: 'GET' })
// → { url: 'https://example.com/dashboard', method: 'GET' }

// Subfolder dedup:
// baseUrl = 'http://localhost/myapp'
route({ url: '/myapp/dashboard' })
// → { url: 'http://localhost/myapp/dashboard' } // not doubled!
```

---

## `routeUrl(routeDefinition)`

Convenience wrapper — returns just the URL string.

```typescript
function routeUrl<T extends AnyRoute>(routeDefinition: T): string
```

**Example:**
```typescript
routeUrl({ url: '/users/123' })
// → 'https://example.com/users/123'
```

---

## `buildRoute(path, options?)`

Builds a complete URL with optional query parameters and fragment.

```typescript
function buildRoute(
  path: string,
  options?: {
    query?: QueryParams;
    fragment?: string;
    absolute?: boolean;  // default: true
  }
): string
```

**Options:**
- `query` — Object of key-value pairs (supports arrays → repeated params like `tags[]=a&tags[]=b`)
- `fragment` — Hash fragment (without `#`)
- `absolute` — Set to `false` for relative URLs

**Deduplication**: When `absolute: true`, subfolder path deduplication is applied.

**Examples:**
```typescript
buildRoute('/search', { query: { q: 'test', page: 2 } })
// → 'https://example.com/search?q=test&page=2'

buildRoute('/page', { fragment: 'section-1' })
// → 'https://example.com/page#section-1'

buildRoute('/api/users', { absolute: false })
// → '/api/users'
```

---

## `makeRoute(definition)`

Builds a route from a `RouteDefinition` object. Always returns absolute URL.

```typescript
function makeRoute(definition: RouteDefinition): string
```

**Example:**
```typescript
makeRoute({
  url: '/search',
  query: { q: 'test' },
  fragment: 'results'
})
// → 'https://example.com/search?q=test#results'
```

---

## `isCurrentRoute(path, useHost?, exact?)`

Checks if a path matches the current browser location.

```typescript
function isCurrentRoute(
  path: string,
  useHost?: boolean,  // default: false (compare pathname only)
  exact?: boolean     // default: false (partial match)
): boolean
```

**Returns** `false` in SSR context (no `window`).

**Example:**
```typescript
// Current URL: https://example.com/dashboard/settings
isCurrentRoute('/dashboard')                     // true
isCurrentRoute('/dashboard', false, true)        // false (not exact)
isCurrentRoute('/dashboard/settings', false, true) // true
```

---

## `currentPath()`

Returns the current pathname. SSR-safe (returns `''` on server).

```typescript
function currentPath(): string
```

---

## `currentUrl()`

Returns the full current URL. SSR-safe (returns `''` on server).

```typescript
function currentUrl(): string
```

---

## `assetUrl(assetPath, options?)`

Builds an absolute URL for an asset path. Wraps `buildRoute()`.

```typescript
function assetUrl(assetPath: string, options?: BuildRouteOptions): string
```

**Example:**
```typescript
assetUrl('/images/logo.png')
// → 'https://example.com/images/logo.png'
```

---

## Init Functions (from `/init`)

| Function | Purpose |
|----------|---------|
| `initRouteHelper(data)` | Extracts `baseUrl` from Inertia props and sets it |
| `configure(options)` | Sets baseUrl, trailingSlash, validateRoutes |
| `setBaseUrl(url)` | Manually set base URL |
| `getBaseUrl()` | Get current base URL |
| `getConfig()` | Get current configuration |

---

## Types

| Type | Definition |
|------|-----------|
| `AnyRoute` | `{ url: string; [key: string]: any }` |
| `RouteDefinition` | `{ url: string; params?: RouteParams; query?: QueryParams; fragment?: string; [key: string]: any }` |
| `QueryParams` | `Record<string, string \| number \| boolean \| (string \| number \| boolean)[] \| null \| undefined>` |
| `RouteParams` | `Record<string, any>` |
| `RouteHelperConfig` | `{ baseUrl?: string; trailingSlash?: boolean; validateRoutes?: boolean }` |
| `BuildRouteOptions` | `{ query?: QueryParams; fragment?: string; absolute?: boolean }` |
