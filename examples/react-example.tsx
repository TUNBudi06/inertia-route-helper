import React, { useState } from 'react';
import { Link, router } from '@inertiajs/react';
import {
  route,
  routeUrl,
  buildRoute,
  isCurrentRoute,
  currentPath
} from '@tunbudi06/inertia-route-helper';

// Assuming you have Ziggy/Wayfinder routes
import { dashboard, profile, posts, search } from '@/routes';

interface User {
  id: number;
  name: string;
}

interface NavigationProps {
  user: User;
}

export function Navigation({ user }: NavigationProps) {
  return (
    <nav className="flex gap-4 p-4 bg-gray-100">
      <Link
        href={routeUrl(dashboard())}
        className={`px-4 py-2 rounded ${
          isCurrentRoute('/dashboard') 
            ? 'bg-blue-500 text-white' 
            : 'bg-white'
        }`}
      >
        Dashboard
      </Link>

      <Link
        href={routeUrl(profile({ id: user.id }))}
        className={`px-4 py-2 rounded ${
          isCurrentRoute(`/profile/${user.id}`, true) 
            ? 'bg-blue-500 text-white' 
            : 'bg-white'
        }`}
      >
        Profile
      </Link>

      <Link
        href={routeUrl(posts())}
        className={`px-4 py-2 rounded ${
          isCurrentRoute('/posts') 
            ? 'bg-blue-500 text-white' 
            : 'bg-white'
        }`}
      >
        Posts
      </Link>
    </nav>
  );
}

export function SearchForm() {
  const [query, setQuery] = useState('');
  const [filters, setFilters] = useState({
    category: 'all',
    sort: 'recent',
    page: 1
  });

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();

    // Build URL with query parameters
    const searchUrl = buildRoute('/search', {
      query: {
        q: query,
        category: filters.category,
        sort: filters.sort,
        page: filters.page
      },
      fragment: 'results'
    });

    router.visit(searchUrl);
  };

  return (
    <form onSubmit={handleSearch} className="p-4">
      <div className="flex gap-2">
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search..."
          className="flex-1 px-4 py-2 border rounded"
        />

        <select
          value={filters.category}
          onChange={(e) => setFilters({ ...filters, category: e.target.value })}
          className="px-4 py-2 border rounded"
        >
          <option value="all">All Categories</option>
          <option value="posts">Posts</option>
          <option value="users">Users</option>
          <option value="products">Products</option>
        </select>

        <button
          type="submit"
          className="px-6 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          Search
        </button>
      </div>
    </form>
  );
}

export function PostsList({ posts: postList }: { posts: any[] }) {
  const handleFilterByTag = (tag: string) => {
    const url = buildRoute('/posts', {
      query: {
        tags: [tag],
        sort: 'popular'
      }
    });
    router.visit(url);
  };

  return (
    <div className="p-4">
      <h2 className="text-2xl font-bold mb-4">Posts</h2>

      {postList.map((post) => (
        <article key={post.id} className="mb-4 p-4 border rounded">
          <h3 className="text-xl font-semibold">
            <Link
              href={routeUrl(posts.show({ id: post.id }))}
              className="text-blue-500 hover:underline"
            >
              {post.title}
            </Link>
          </h3>

          <p className="text-gray-600 mt-2">{post.excerpt}</p>

          <div className="flex gap-2 mt-4">
            {post.tags.map((tag: string) => (
              <button
                key={tag}
                onClick={() => handleFilterByTag(tag)}
                className="px-3 py-1 bg-gray-200 rounded text-sm hover:bg-gray-300"
              >
                {tag}
              </button>
            ))}
          </div>

          <div className="flex gap-4 mt-4">
            <Link
              href={routeUrl(posts.edit({ id: post.id }))}
              className="text-blue-500 hover:underline"
            >
              Edit
            </Link>

            <button
              onClick={() => {
                router.delete(routeUrl(posts.destroy({ id: post.id })));
              }}
              className="text-red-500 hover:underline"
            >
              Delete
            </button>
          </div>
        </article>
      ))}
    </div>
  );
}

// Example with configuration
export function App() {
  React.useEffect(() => {
    // Optional: Configure additional route helper settings
    // Note: baseUrl should be set via initRouteHelper() in your app setup
    import('inertia-route-helper').then(({ configure }) => {
      configure({
        trailingSlash: false,
        validateRoutes: false
      });
    });
  }, []);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Your app content */}
    </div>
  );
}

// Current path example
export function Breadcrumbs() {
  const path = currentPath();
  const segments = path.split('/').filter(Boolean);

  return (
    <nav className="flex gap-2 p-4 text-sm">
      <Link href={routeUrl(dashboard())} className="text-blue-500">
        Home
      </Link>
      {segments.map((segment, index) => (
        <React.Fragment key={index}>
          <span>/</span>
          <span className="capitalize">{segment}</span>
        </React.Fragment>
      ))}
    </nav>
  );
}
