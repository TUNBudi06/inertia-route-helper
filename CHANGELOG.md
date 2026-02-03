# Changelog

All notable changes to this project will be documented in this file.

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
