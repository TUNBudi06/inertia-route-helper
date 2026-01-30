# Changelog

All notable changes to this project will be documented in this file.

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
