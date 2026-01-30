<script setup lang="ts">
import { ref, computed } from 'vue';
import { Link, router } from '@inertiajs/vue3';
import {
  route,
  routeUrl,
  buildRoute,
  isCurrentRoute,
  currentPath,
  configure
} from 'inertia-route-helper';

// Assuming you have Ziggy/Wayfinder routes
import { dashboard, profile, posts, search } from '@/routes';

interface User {
  id: number;
  name: string;
}

interface Props {
  user: User;
  posts?: any[];
}

const props = defineProps<Props>();

// Navigation example
const navLinks = computed(() => [
  {
    label: 'Dashboard',
    href: routeUrl(dashboard()),
    active: isCurrentRoute('/dashboard')
  },
  {
    label: 'Profile',
    href: routeUrl(profile({ id: props.user.id })),
    active: isCurrentRoute(`/profile/${props.user.id}`, true)
  },
  {
    label: 'Posts',
    href: routeUrl(posts()),
    active: isCurrentRoute('/posts')
  }
]);

// Search form example
const searchQuery = ref('');
const searchFilters = ref({
  category: 'all',
  sort: 'recent',
  page: 1
});

const handleSearch = () => {
  const searchUrl = buildRoute('/search', {
    query: {
      q: searchQuery.value,
      category: searchFilters.value.category,
      sort: searchFilters.value.sort,
      page: searchFilters.value.page
    },
    fragment: 'results'
  });

  router.visit(searchUrl);
};

// Filter by tag
const filterByTag = (tag: string) => {
  const url = buildRoute('/posts', {
    query: {
      tags: [tag],
      sort: 'popular'
    }
  });
  router.visit(url);
};

// Breadcrumbs
const breadcrumbs = computed(() => {
  const path = currentPath();
  return path.split('/').filter(Boolean);
});

// Configuration (optional)
configure({
  trailingSlash: false,
  validateRoutes: false
});
</script>

<template>
  <div class="min-h-screen bg-gray-50">
    <!-- Navigation -->
    <nav class="flex gap-4 p-4 bg-gray-100">
      <Link
        v-for="link in navLinks"
        :key="link.label"
        :href="link.href"
        :class="[
          'px-4 py-2 rounded',
          link.active ? 'bg-blue-500 text-white' : 'bg-white'
        ]"
      >
        {{ link.label }}
      </Link>
    </nav>

    <!-- Breadcrumbs -->
    <nav class="flex gap-2 p-4 text-sm">
      <Link :href="routeUrl(dashboard())" class="text-blue-500">
        Home
      </Link>
      <template v-for="(segment, index) in breadcrumbs" :key="index">
        <span>/</span>
        <span class="capitalize">{{ segment }}</span>
      </template>
    </nav>

    <!-- Search Form -->
    <form @submit.prevent="handleSearch" class="p-4">
      <div class="flex gap-2">
        <input
          v-model="searchQuery"
          type="text"
          placeholder="Search..."
          class="flex-1 px-4 py-2 border rounded"
        />

        <select
          v-model="searchFilters.category"
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
    <div v-if="posts" class="p-4">
      <h2 class="text-2xl font-bold mb-4">Posts</h2>

      <article
        v-for="post in posts"
        :key="post.id"
        class="mb-4 p-4 border rounded"
      >
        <h3 class="text-xl font-semibold">
          <Link
            :href="routeUrl(posts.show({ id: post.id }))"
            class="text-blue-500 hover:underline"
          >
            {{ post.title }}
          </Link>
        </h3>

        <p class="text-gray-600 mt-2">{{ post.excerpt }}</p>

        <div class="flex gap-2 mt-4">
          <button
            v-for="tag in post.tags"
            :key="tag"
            @click="filterByTag(tag)"
            class="px-3 py-1 bg-gray-200 rounded text-sm hover:bg-gray-300"
          >
            {{ tag }}
          </button>
        </div>

        <div class="flex gap-4 mt-4">
          <Link
            :href="routeUrl(posts.edit({ id: post.id }))"
            class="text-blue-500 hover:underline"
          >
            Edit
          </Link>

          <button
            @click="router.delete(routeUrl(posts.destroy({ id: post.id })))"
            class="text-red-500 hover:underline"
          >
            Delete
          </button>
        </div>
      </article>
    </div>
  </div>
</template>

<style scoped>
/* Add your styles here */
</style>
