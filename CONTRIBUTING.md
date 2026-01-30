# Contributing to Inertia Route Helper

First off, thank you for considering contributing to Inertia Route Helper! 🎉

## How Can I Contribute?

### Reporting Bugs

Before creating bug reports, please check the existing issues to avoid duplicates. When you create a bug report, include as many details as possible:

- **Use a clear and descriptive title**
- **Describe the exact steps to reproduce the problem**
- **Provide specific examples** - Include code snippets or test cases
- **Describe the behavior you observed** and what you expected
- **Include your environment details** - Node version, Inertia version, framework (React/Vue/Svelte), etc.

### Suggesting Enhancements

Enhancement suggestions are welcome! Please provide:

- **A clear and descriptive title**
- **A detailed description of the proposed feature**
- **Explain why this enhancement would be useful**
- **List any alternatives you've considered**

### Pull Requests

1. **Fork the repository** and create your branch from `main`
2. **Make your changes** - Follow the coding style of the project
3. **Test your changes** - Ensure the package builds successfully
4. **Update documentation** - Update README.md if needed
5. **Write clear commit messages** - Use conventional commit format
6. **Submit a pull request**

## Development Setup

### Prerequisites

- Node.js 18 or higher
- npm, yarn, or pnpm

### Getting Started

```bash
# Clone your fork
git clone https://github.com/YOUR-USERNAME/inertia-route-helper.git
cd inertia-route-helper

# Install dependencies
npm install

# Start development mode (watch for changes)
npm run dev

# Build the package
npm run build
```

### Project Structure

```
inertia-route-helper/
├── src/
│   ├── index.ts      # Main exports and route functions
│   ├── store.ts      # State management and configuration
│   └── types.ts      # TypeScript type definitions
├── examples/         # Usage examples for different frameworks
├── dist/             # Compiled output (git-ignored)
└── package.json
```

## Coding Guidelines

### TypeScript

- Use TypeScript for all source files
- Provide proper type definitions
- Avoid using `any` unless absolutely necessary
- Export all public types

### Code Style

- Use 2 spaces for indentation
- Use semicolons
- Use single quotes for strings
- Add JSDoc comments for public functions
- Keep functions focused and small

### Example Function Documentation

```typescript
/**
 * Build a complete URL with query parameters and fragment
 * 
 * @param path - The base path for the route
 * @param options - Optional configuration object
 * @param options.query - Query parameters to append
 * @param options.fragment - Fragment identifier (hash)
 * @param options.absolute - Whether to include base URL (default: true)
 * @returns The complete URL string
 * 
 * @example
 * buildRoute('/search', { 
 *   query: { q: 'inertia' }, 
 *   fragment: 'results' 
 * });
 * // Returns: 'https://example.com/search?q=inertia#results'
 */
export function buildRoute(path: string, options?: {...}): string {
  // Implementation
}
```

## Testing

Currently, the package uses manual testing. We welcome contributions to add:

- Unit tests with Vitest or Jest
- Integration tests with Inertia.js
- E2E tests for different frameworks

## Commit Messages

Use conventional commit format:

```
type(scope): subject

body (optional)

footer (optional)
```

### Types

- `feat`: New feature
- `fix`: Bug fix
- `docs`: Documentation changes
- `style`: Code style changes (formatting, etc.)
- `refactor`: Code refactoring
- `test`: Adding or updating tests
- `chore`: Build process or auxiliary tool changes

### Examples

```
feat: add support for nested query parameters
fix: resolve SSR issue with window object
docs: update README with Svelte examples
```

## Release Process

Releases are managed by the maintainers:

1. Update version in `package.json`
2. Update `CHANGELOG.md`
3. Create a git tag
4. Publish to npm

## Questions?

Feel free to open an issue with the `question` label, or reach out to the maintainers.

## License

By contributing, you agree that your contributions will be licensed under the MIT License.
