# Subfolder Path Deduplication

> **Introduced in v2.1.0**

## The Problem

When deploying an Inertia app in a subfolder (e.g., `http://localhost/subfolder/public`), some routing libraries (Ziggy, Wayfinder) may generate route paths that already include the subfolder path. This causes **URL doubling**:

```
baseUrl:  http://localhost/subfolder/public
path:     /subfolder/public/dashboard

OLD result:  http://localhost/subfolder/public/subfolder/public/dashboard  ❌ duplicated!
EXPECTED:    http://localhost/subfolder/public/dashboard                   ✅
```

## The Solution

The helper automatically detects when a route path already contains the base URL's path portion and **deduplicates** it. The logic is:

1. Extract the **path portion** of `baseUrl` using `new URL(baseUrl).pathname`
   - `http://localhost/subfolder/public` → `/subfolder/public`
   - `http://localhost` → `` (empty)
2. Check if the route path **starts with** the base path (followed by `/` or exact match)
3. If yes → only prepend the **origin** part, keeping the route path as-is
4. If no → prepend the full `baseUrl` as normal

## How It Works

```typescript
// Internal logic in state.ts
function resolveBasePath(path: string): string {
  // 1. Extract pathname from baseUrl
  const basePath = new URL(baseUrl).pathname.replace(/\/$/, '');

  // 2. If no base path, just concatenate
  if (!basePath) return baseUrl + path;

  // 3. If path already contains base path, deduplicate
  if (path === basePath || path.startsWith(basePath + '/')) {
    const origin = baseUrl.slice(0, -basePath.length);
    return origin + path;  // Only prepend origin, keep path intact
  }

  // 4. Normal case: prepend full baseUrl
  return baseUrl + path;
}
```

## Edge Cases Handled

| Scenario | baseUrl | path | Result |
|----------|---------|------|--------|
| Normal route | `http://localhost/myapp` | `/dashboard` | `http://localhost/myapp/dashboard` |
| Already includes subfolder | `http://localhost/myapp` | `/myapp/dashboard` | `http://localhost/myapp/dashboard` |
| Exact match | `http://localhost/myapp` | `/myapp` | `http://localhost/myapp` |
| Similar prefix (not subfolder) | `http://localhost/myapp` | `/myappointments` | `http://localhost/myapp/myappointments` |
| No base path | `http://localhost` | `/dashboard` | `http://localhost/dashboard` |
| Empty baseUrl | `` | `/dashboard` | `/dashboard` |

The **similar prefix** case (`/myappointments`) is handled correctly because the code checks for the base path followed by `/` or end-of-string, not just a prefix match.

## Which Functions Are Affected

All URL-building functions benefit from deduplication:

| Function | Dedup Applied? |
|----------|---------------|
| `route()` | ✅ Directly |
| `routeUrl()` | ✅ (wraps `route()`) |
| `buildRoute()` (absolute) | ✅ Directly |
| `buildRoute()` (relative) | ❌ Not applicable |
| `makeRoute()` | ✅ (wraps `buildRoute()`) |
| `assetUrl()` | ✅ (wraps `buildRoute()`) |
| `isCurrentRoute()` | ❌ Not applicable |

## Backward Compatibility

This change is **fully backward compatible**. Existing routes that don't include the subfolder path behave exactly as before. The deduplication only activates when the route path explicitly contains the base path.
