<script lang="ts">
  import { router } from '@inertiajs/svelte';
  import {
    route,
    routeUrl,
    buildRoute,
    isCurrentRoute,
    currentPath,
    configure
  } from 'inertia-route-helper';

  // Assuming you have Ziggy/Wayfinder routes
  import { dashboard, profile, posts, search } from '$lib/routes';

  interface User {
    id: number;
    name: string;
  }

  interface Post {
    id: number;
    title: string;
    excerpt: string;
    tags: string[];
  }

  export let user: User;
  export let posts: Post[] = [];

  // Navigation
  let navLinks = [
    {
      label: 'Dashboard',
      href: routeUrl(dashboard()),
      path: '/dashboard'
    },
    {
      label: 'Profile',
      href: routeUrl(profile({ id: user.id })),
      path: `/profile/${user.id}`,
      exact: true
    },
    {
      label: 'Posts',
      href: routeUrl(posts()),
      path: '/posts'
    }
  ];

  // Search
  let searchQuery = '';
  let searchCategory = 'all';
  let searchSort = 'recent';

  function handleSearch() {
    const searchUrl = buildRoute('/search', {
      query: {
        q: searchQuery,
        category: searchCategory,
        sort: searchSort
      },
      fragment: 'results'
    });

    router.visit(searchUrl);
  }

  // Filter by tag
  function filterByTag(tag: string) {
    const url = buildRoute('/posts', {
      query: {
        tags: [tag],
        sort: 'popular'
      }
    });
    router.visit(url);
  }

  // Delete post
  function deletePost(postId: number) {
    if (confirm('Are you sure?')) {
      router.delete(routeUrl(posts.destroy({ id: postId })));
    }
  }

  // Breadcrumbs
  $: breadcrumbs = currentPath().split('/').filter(Boolean);

  // Configuration (optional)
  configure({
    trailingSlash: false,
    validateRoutes: false
  });
</script>

<div class="min-h-screen bg-gray-50">
  <!-- Navigation -->
  <nav class="flex gap-4 p-4 bg-gray-100">
    {#each navLinks as link}
      <a
        href={link.href}
        class="px-4 py-2 rounded {isCurrentRoute(link.path, link.exact)
          ? 'bg-blue-500 text-white'
          : 'bg-white'}"
      >
        {link.label}
      </a>
    {/each}
  </nav>

  <!-- Breadcrumbs -->
  <nav class="flex gap-2 p-4 text-sm">
    <a href={routeUrl(dashboard())} class="text-blue-500">
      Home
    </a>
    {#each breadcrumbs as segment, index}
      <span>/</span>
      <span class="capitalize">{segment}</span>
    {/each}
  </nav>

  <!-- Search Form -->
  <form on:submit|preventDefault={handleSearch} class="p-4">
    <div class="flex gap-2">
      <input
        bind:value={searchQuery}
        type="text"
        placeholder="Search..."
        class="flex-1 px-4 py-2 border rounded"
      />

      <select
        bind:value={searchCategory}
        class="px-4 py-2 border rounded"
      >
        <option value="all">All Categories</option>
        <option value="posts">Posts</option>
        <option value="users">Users</option>
        <option value="products">Products</option>
      </select>

      <button
        type="submit"
        class="px-6 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
      >
        Search
      </button>
    </div>
  </form>

  <!-- Posts List -->
  {#if posts.length > 0}
    <div class="p-4">
      <h2 class="text-2xl font-bold mb-4">Posts</h2>

      {#each posts as post (post.id)}
        <article class="mb-4 p-4 border rounded">
          <h3 class="text-xl font-semibold">
            <a
              href={routeUrl(posts.show({ id: post.id }))}
              class="text-blue-500 hover:underline"
            >
              {post.title}
            </a>
          </h3>

          <p class="text-gray-600 mt-2">{post.excerpt}</p>

          <div class="flex gap-2 mt-4">
            {#each post.tags as tag}
              <button
                on:click={() => filterByTag(tag)}
                class="px-3 py-1 bg-gray-200 rounded text-sm hover:bg-gray-300"
              >
                {tag}
              </button>
            {/each}
          </div>

          <div class="flex gap-4 mt-4">
            <a
              href={routeUrl(posts.edit({ id: post.id }))}
              class="text-blue-500 hover:underline"
            >
              Edit
            </a>

            <button
              on:click={() => deletePost(post.id)}
              class="text-red-500 hover:underline"
            >
              Delete
            </button>
          </div>
        </article>
      {/each}
    </div>
  {/if}
</div>

<style>
  /* Add your styles here */
</style>
