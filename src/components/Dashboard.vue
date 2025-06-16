<script setup lang="ts">
import { ref } from 'vue'
import { useAuthStore } from '@/store/authStore'

import ArticleCard from '@/components/common/ArticleCard.vue'
import VideoCard from '@/components/common/VideoCard.vue'

const auth = useAuthStore()

const userTier = auth.userTier

const articles = ref([
  {
    id: 1,
    title: 'Getting Started with Vue.js',
    content: 'Learn the basics of Vue.js framework.',
    access_tier: 'free',
    author_id: 1,
    created_at: '2025-06-01T08:00:00Z',
    updated_at: '2025-06-01T08:00:00Z',
  },
  {
    id: 2,
    title: 'Building Fullstack Apps',
    content: 'Connect frontend to backend using APIs.',
    access_tier: 'basic',
    author_id: 2,
    created_at: '2025-06-05T10:30:00Z',
    updated_at: '2025-06-05T10:30:00Z',
  },
  {
    id: 3,
    title: 'Vue Performance Tips',
    content: 'Optimize your Vue app for speed.',
    access_tier: 'premium',
    author_id: 3,
    created_at: '2025-06-10T13:15:00Z',
    updated_at: '2025-06-10T13:15:00Z',
  },
])

const videos = ref([
  {
    id: 1,
    title: 'Intro to Web Dev',
    description: 'Foundations of web development.',
    video_url: 'https://example.com/video1.mp4',
    thumbnail_url: 'https://placehold.co/300x200?text=Video+1',
    access_tier: 'free',
    author_id: 1,
    created_at: '2025-06-01T10:00:00Z',
    updated_at: '2025-06-01T10:00:00Z',
  },
  {
    id: 2,
    title: 'Deploying with Docker',
    description: 'Setup CI/CD pipelines.',
    video_url: 'https://example.com/video2.mp4',
    thumbnail_url: 'https://placehold.co/300x200?text=Video+2',
    access_tier: 'basic',
    author_id: 2,
    created_at: '2025-06-05T12:00:00Z',
    updated_at: '2025-06-05T12:00:00Z',
  },
  {
    id: 3,
    title: 'Vue Animations',
    description: 'Make your app lively.',
    video_url: 'https://example.com/video3.mp4',
    thumbnail_url: 'https://placehold.co/300x200?text=Video+3',
    access_tier: 'premium',
    author_id: 3,
    created_at: '2025-06-10T15:30:00Z',
    updated_at: '2025-06-10T15:30:00Z',
  },
])
</script>

<template>
  <div class="p-6 space-y-8">
    <!-- Welcome Banner -->
    <div class="text-center">
      <h1 class="text-3xl font-bold text-purple-700">Welcome to ShareSphere!</h1>
      <p class="text-gray-600">Explore thousand of videos and articles here!</p>
    </div>

    <!-- Articles Section -->
    <div>
      <h2 class="text-xl font-semibold mb-4 text-gray-800">Featured Articles</h2>
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <ArticleCard
          v-for="article in articles"
          :key="article.id"
          :article="article"
          :userTier="userTier"
        />
      </div>
    </div>

    <!-- Videos Section -->
    <div>
      <h2 class="text-xl font-semibold mb-4 text-gray-800">Top Videos</h2>
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <VideoCard v-for="video in videos" :key="video.id" :video="video" :userTier="userTier" />
      </div>
    </div>
  </div>
</template>
