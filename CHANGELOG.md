# Changelog

All notable changes to this project will be documented in this file.

## [3.0.0] - 2026-05-22

### 🎉 Inertia.js v3 Support + Subfolder Deduplication

### Added
- 🚀 **Inertia.js v3 Support** - Peer dependency updated to `^2.0.0 || ^3.0.0`
  - Works seamlessly with both Inertia v2 and v3 applications
  - No API changes required — same familiar interface
  - Full backward compatibility
- 🧠 **Smart Subfolder Deduplication** - Route paths that already contain the base URL's subfolder path are now automatically deduplicated
  - Previously: `route({ url: '/myapp/dashboard' })` with baseUrl `http://localhost/myapp` would produce `http://localhost/myapp/myapp/dashboard`
  - Now: Correctly produces `http://localhost/myapp/dashboard`
  - Essential for Inertia v3 which includes subfolder paths by default in deployed apps
  - Works with Ziggy, Wayfinder, and any route definition
- 🧠 **Smart `assetUrl()`** - Detects absolute URLs (http://, https://, //, data:, blob:, etc.) and passes them through as-is instead of prepending baseUrl
  - Relative paths still get baseUrl prepended as before
  - Perfect for mixed local/CDN assets
- 🧪 **17 new tests** - Comprehensive coverage for subfolder dedup and assetUrl scenarios
- 📁 **`docs/` folder** - Added dedicated documentation folder with AI-friendly docs

### Changed
- ⬆️ **Updated dev dependency** to `@inertiajs/core@^3.0.0` for testing against latest
- 🔧 **`resolveBasePath()` internal utility** - Added to `src/state.ts` for centralized URL resolution with deduplication logic
  - Extracts base URL pathname via `new URL()`
  - Checks if route path already starts with base path (followed by `/` or exact match)
  - Strips only the origin portion, keeping the full route path intact
- ♻️ **`route()` and `buildRoute()` functions** - Updated to use `resolveBasePath()` instead of raw string concatenation
  - `assetUrl()` benefits automatically since it wraps `buildRoute()`
- 📚 **Updated documentation** - All docs updated for Inertia v3 compatibility

### Technical Details
- Edge-case safe: `/myapp` base path does NOT match `/myappointments` (requires `/` separator after base path)
- Works with any subfolder depth (e.g., `/subfolder/public/deeper`)
- Zero bundle size increase (minor code addition in shared chunk)
- All 82 tests passing ✅

### Migration from v2.x

No migration steps needed. Simply update:
```bash
npm install @tunbudi06/inertia-route-helper@latest
```

If you're using Inertia v3, the upgrade is seamless — same API, same imports.

## [2.1.0] - 2026-05-22

### ✨ Subfolder Path Deduplication

### Added
- 🧠 **Smart Subfolder Deduplication** - Route paths that already contain the base URL's subfolder path are now automatically deduplicated
  - Previously: `route({ url: '/myapp/dashboard' })` with baseUrl `http://localhost/myapp` would produce `http://localhost/myapp/myapp/dashboard`
  - Now: Correctly produces `http://localhost/myapp/dashboard`
  - Works with Ziggy, Wayfinder, and any route definition
- 🧪 **New tests added** - Comprehensive coverage for subfolder dedup scenarios
- 📁 **`docs/` folder** - Added dedicated documentation folder with AI-friendly docs

### Changed
- 🔧 **`resolveBasePath()` internal utility** - Added to `src/state.ts` for centralized URL resolution with deduplication logic
  - Extracts base URL pathname via `new URL()`
  - Checks if route path already starts with base path (followed by `/` or exact match)
  - Strips only the origin portion, keeping the full route path intact
- ♻️ **`route()` and `buildRoute()` functions** - Updated to use `resolveBasePath()` instead of raw string concatenation
  - `assetUrl()` benefits automatically since it wraps `buildRoute()`
- 📚 **Updated API docs** - Added deduplication examples and feature documentation

### Technical Details
- Edge-case safe: `/myapp` base path does NOT match `/myappointments` (requires `/` separator after base path)
- Works with any subfolder depth (e.g., `/subfolder/public/deeper`)
- Zero bundle size increase (minor code addition in shared chunk)
- All 65 existing tests continue to pass ✅

## [2.0.2] - 2026-02-03

### 🐛 Critical Bug Fix

### Fixed
- 🔥 **State Duplication Issue** - Fixed critical bug where `splitting: false` in tsup config caused duplicate state instances
  - Previously, `/init` and main index had separate copies of state
  - Calling `initRouteHelper()` would set baseUrl in init's state copy
  - Calling `route()` would read from index's empty state copy
  - **Solution**: Enabled code splitting (`splitting: true`) to create shared chunk
  - Now all imports share the same state instance via `dist/chunk-*.js`
- 📦 **Smaller Bundle Size** - Shared chunk eliminates duplicate code (bonus improvement)

### Changed
- 📁 **Test Organization** - Migrated all test files from `src/` to dedicated `test/` folder
  - Moved `src/index.test.ts` → `test/index.test.ts`
  - Moved `src/integration.test.ts` → `test/integration.test.ts`
  - Updated `vitest.config.ts` to use `test/**/*.test.ts` pattern
  - Cleaner source directory with only production code
  - Test structure now mirrors `src/` structure
  - All 65 tests passing ✅

### Technical Details
- Changed `splitting: false` to `splitting: true` in `tsup.config.ts`
- Build now generates shared chunk for common code (state.ts)
- Both entry points (`index.js` and `init.js`) import from shared chunk
- Ensures consistent state across all package imports
- Test files updated with correct relative imports (`../src/`)
- Updated coverage exclusions to include `test/` folder

## [2.0.0] - 2026-02-03

### 🎉 Major Release - Modular Single-Function Architecture

### Added
- 🎯 **One Function Per File** - Each function in its own file for maximum readability and maintainability
- 📦 **Separate `/init` Module** - Dedicated import path for initialization and configuration functions
- 📚 **Comprehensive Documentation** - Complete guides and examples
- 🧪 **Extended Test Coverage** - Comprehensive tests with 100% coverage
- 📖 **Enhanced JSDoc** - Complete inline documentation for all functions
- 🔧 **State Management** - Centralized state in `state.ts` for clean architecture

### Changed
- ⚠️ **BREAKING**: Functions moved to separate files with dedicated directories
  - `src/functions/` - Contains route helper functions (route, buildRoute, etc.)
  - `src/init-functions/` - Contains initialization functions (initRouteHelper, configure)
  - `src/state.ts` - Centralized state management
- 📦 **Import Structure**:
  - Main: `import { route, buildRoute } from '@tunbudi06/inertia-route-helper'`
  - Init: `import { initRouteHelper, configure } from '@tunbudi06/inertia-route-helper/init'`
- 🔧 **Cleaner Architecture** - Modular design with single responsibility per file
- 🪶 **Better Organization** - Functions grouped by purpose in dedicated directories

### Architecture

```
src/
├── functions/          # Route helper functions
│   ├── route.ts
│   ├── routeUrl.ts
│   ├── buildRoute.ts
│   ├── buildQueryString.ts
│   ├── makeRoute.ts
│   ├── isCurrentRoute.ts
│   ├── currentPath.ts
│   ├── currentUrl.ts
│   └── assetUrl.ts
├── init-functions/     # Initialization functions
│   ├── initRouteHelper.ts
│   └── configure.ts
├── state.ts           # Centralized state management
├── types.ts           # TypeScript type definitions
├── index.ts           # Main exports (route functions)
└── init.ts            # Init exports (initialization)
```

### Migration Guide

**Setup (in app.tsx/app.ts):**
```typescript
import { initRouteHelper, configure } from '@tunbudi06/inertia-route-helper/init';

createInertiaApp({
  setup({ el, App, props }) {
    initRouteHelper(props);
    // ...
  }
});
```

**Usage (in components):**
```typescript
import { route, buildRoute, isCurrentRoute } from '@tunbudi06/inertia-route-helper';

const url = route({ url: '/dashboard' }).url;
```

### Benefits
- ✅ Maximum readability - one function per file
- ✅ Easy to find and modify specific functions
- ✅ Better code organization - grouped by purpose
- ✅ Cleaner imports - separate setup from usage
- ✅ Better maintainability - single responsibility principle
- ✅ Still lightweight and fully tested

## [1.0.0] - 2026-01-30

### 🎉 Major Release - Inertia.js v2 Support

### Added
- ✨ **Super Simple Init** - Just `initRouteHelper(props)` - automatically finds `initialPage.props.baseUrl`
- ✨ **Query Parameter Support** - Build routes with query strings using `buildRoute()` and `makeRoute()`
- 🎯 **Route Validation** - New `isCurrentRoute()` function to check if routes match current path
- 📍 **Navigation Helpers** - Added `currentPath()` and `currentUrl()` utilities
- ⚙️ **Configuration System** - New `configure()` function for customizing behavior
- 📝 **Enhanced TypeScript Types** - Added `RouteDefinition`, `QueryParams`, `RouteParams`, and `RouteHelperConfig`
- 🎨 **Fragment Support** - Add URL fragments (hash) to routes
- 🔄 **Array Query Parameters** - Support for array values in query strings
- 📚 **Comprehensive Documentation** - Beautiful README with examples for React, Vue, and Svelte
- 🧪 **70+ Comprehensive Tests** - 100% test coverage with unit and integration tests

### Changed
- ⬆️ **BREAKING**: Updated to Inertia.js v2.0 (peer dependency)
- 🔄 Simplified API - just pass `props` instead of `props.initialPage`
- 📦 Enhanced TypeScript definitions for better type safety
- 🎯 More flexible API with multiple ways to build routes
- 🪶 Removed unused exports for smaller bundle

### Improved
- 🚀 Better SSR safety checks
- 🪶 **Super lightweight** - Only **1.66 KB minified** (~700 bytes gzipped)
- 📖 Enhanced code documentation and JSDoc comments
- 🎨 Better trailing slash handling
- ⚡ Optimized and minified output - 50% smaller than initial version

## [0.1.0] - 2024

### Added
- 🎉 Initial release
- 🔗 Absolute URL wrapper for Wayfinder/Ziggy routes
- 📁 Subfolder deployment support
- 🌐 SSR safe fallback
- 💪 Basic TypeScript support
