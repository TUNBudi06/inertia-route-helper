# Architecture

## Directory Structure

```
src/
├── functions/          # Route helper functions (one per file)
│   ├── route.ts            Core: transforms route definition → absolute URL
│   ├── routeUrl.ts         Wrapper: returns just the URL string
│   ├── buildRoute.ts       Core: builds URL from path + options (query, fragment)
│   ├── buildQueryString.ts Utility: builds ?key=val&key2=val2 string
│   ├── makeRoute.ts        Wrapper: buildRoute from RouteDefinition object
│   ├── isCurrentRoute.ts   Check if path matches current browser location
│   ├── currentPath.ts      Get current pathname (SSR-safe)
│   ├── currentUrl.ts       Get current full URL (SSR-safe)
│   └── assetUrl.ts         Build absolute URL for asset files
├── init-functions/     # Initialization functions
│   ├── initRouteHelper.ts  Extract baseUrl from Inertia props
│   └── configure.ts        Set global configuration
├── state.ts            # Centralized state (baseUrl, config) + resolveBasePath utility
├── types.ts            # TypeScript type definitions
├── index.ts            # Main exports (route functions)
└── init.ts             # Init exports (init/config functions)
test/
├── index.test.ts       # Unit tests for all functions
└── integration.test.ts # Integration tests for real-world scenarios
docs/                   # AI-friendly documentation
├── README.md
├── functions.md
├── subfolder-dedup.md
└── architecture.md
```

## Data Flow

```
[User calls initRouteHelper(props)]
  → init-functions/initRouteHelper.ts
    → state.ts: setBaseUrl(url)  [stores in module-scoped variable]

[User calls route({ url: '/dashboard' })]
  → functions/route.ts
    → state.ts: resolveBasePath(path)
      → state.ts: getBasePathname() [extracts path portion from baseUrl]
      → deduplication logic applied
    → returns absolute URL

[User calls buildRoute('/search', { query: {...} })]
  → functions/buildRoute.ts
    → state.ts: resolveBasePath(path) [same dedup logic]
    → functions/buildQueryString.ts
    → returns complete URL
```

## State Management

State is held in module-scoped variables in `state.ts`:

```typescript
let baseUrl = '';
let config: RouteHelperConfig = { trailingSlash: false, validateRoutes: false };
```

The build tool (tsup) uses code splitting (`splitting: true`) so both entry points (`index.js` and `init.js`) import from a shared chunk, ensuring **one global state instance**.

## Key Design Decisions

1. **One function per file** — Maximum readability and easy code navigation
2. **Separate `/init` import** — Setup code is kept separate from runtime usage
3. **SSR safety** — All functions that access `window` check for its existence first
4. **State in shared chunk** — Prevents duplicate state instances across imports
5. **Subfolder deduplication in `state.ts`** — Centralized logic ensures all functions benefit consistently
