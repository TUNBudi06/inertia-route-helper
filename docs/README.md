# @tunbudi06/inertia-route-helper — AI/Developer Docs

> **Package**: `@tunbudi06/inertia-route-helper`
> **Version**: 3.0.0
> **Purpose**: Routing helper for Inertia.js v2 & v3 apps (Laravel Ziggy / Wayfinder)

---

## Quick Links

- [Function Reference](./functions.md) — All exported functions with signatures
- [Subfolder Deduplication](./subfolder-dedup.md) — How subfolder path duplication prevention works
- [Architecture](./architecture.md) — Codebase structure and design decisions

---

## What This Package Does

Takes route definitions (from Ziggy, Wayfinder, or plain objects) and transforms them into **absolute URLs** by prepending a configured `baseUrl`. Supports:

- ✅ Subfolder deployments (`https://example.com/my-app/dashboard`)
- ✅ Query parameters and URL fragments
- ✅ Route validation and active-route detection
- ✅ SSR safety (no `window` dependency for URL building)
- ✅ TypeScript-first with full type safety

---

## Key Concepts

### baseUrl
The base URL is set via `initRouteHelper(props)` (extracted from Inertia shared props) or `configure({ baseUrl })`. It represents the root of your application, e.g. `https://example.com` or `https://example.com/my-app`.

### Subfolder Deduplication (v2.1.0+)
If a route definition's `url` already contains the base URL's path portion, the helper strips the duplicate automatically. See [Subfolder Deduplication](./subfolder-dedup.md).

---

## Import Paths

| Import | Contains |
|--------|----------|
| `@tunbudi06/inertia-route-helper` | Route functions (`route`, `buildRoute`, `isCurrentRoute`, etc.) |
| `@tunbudi06/inertia-route-helper/init` | Init/config functions (`initRouteHelper`, `configure`, `setBaseUrl`, `getBaseUrl`) |

---

## Quick Example

```typescript
import { initRouteHelper } from '@tunbudi06/inertia-route-helper/init';
import { route, buildRoute, isCurrentRoute } from '@tunbudi06/inertia-route-helper';

// 1. Initialize with Inertia props
initRouteHelper(props);

// 2. Use in components
const dashboardUrl = route({ url: '/dashboard', method: 'GET' }).url;
const searchUrl = buildRoute('/search', { query: { q: 'hello' } });
const isActive = isCurrentRoute('/dashboard');
```

---

## State Management

All state (baseUrl, config) is managed in a single module (`src/state.ts`). The build system uses code splitting to create a shared chunk, ensuring both import paths (`index` and `init`) share the same state instance.
