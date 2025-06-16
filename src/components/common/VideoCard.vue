<script setup lang="ts">
import { computed } from 'vue'
import Card from 'primevue/card'
import Button from 'primevue/button'

const props = defineProps<{
  video: {
    id: number
    title: string
    description?: string
    video_url: string
    thumbnail_url?: string
    access_tier: string
    author_id?: number
    created_at?: string
    updated_at?: string
  }
  userTier: string
}>()

const tierRank: Record<string, number> = {
  free: 1,
  basic: 2,
  premium: 3,
}

const hasAccess = computed(() => {
  return tierRank[props.userTier] >= tierRank[props.video.access_tier]
})
</script>

<template>
  <Card class="relative overflow-hidden">
    <template #header>
      <img
        :src="video.thumbnail_url || 'https://placehold.co/300x200?text=No+Thumbnail'"
        alt="Video thumbnail"
        class="w-full h-48 object-cover rounded-t"
      />
    </template>
    <template #title>{{ video.title }}</template>
    <template #content>
      <p class="text-sm text-gray-600">{{ video.description }}</p>
      <div
        v-if="!hasAccess"
        class="absolute inset-0 bg-white/80 flex flex-col justify-center items-center text-center px-4 rounded-lg"
      >
        <i class="pi pi-lock text-3xl text-purple-500 mb-2"></i>
        <p class="text-sm text-gray-700 mb-1">
          This video is for <strong>{{ video.access_tier }}</strong> users
        </p>
        <Button label="Upgrade Tier" icon="pi pi-arrow-up" class="mt-2" severity="secondary" />
      </div>
    </template>
  </Card>
</template>
