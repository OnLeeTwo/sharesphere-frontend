<script setup lang="ts">
import { computed } from 'vue'
import Card from 'primevue/card'
import Button from 'primevue/button'
import { format } from 'date-fns'

const props = defineProps<{
  article: {
    id: number
    title: string
    content: string
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
  return tierRank[props.userTier] >= tierRank[props.article.access_tier]
})

const previewText = computed(() => {
  return props.article.content.length > 120
    ? props.article.content.slice(0, 120) + '...'
    : props.article.content
})

const formattedDate = computed(() => {
  return props.article.created_at
    ? format(new Date(props.article.created_at), 'dd MMM yyyy')
    : 'Unknown date'
})
</script>

<template>
  <Card
    class="relative transition-transform transform hover:scale-[1.02] hover:shadow-lg rounded-2xl overflow-hidden border border-gray-200 cursor-pointer"
  >
    <template #content>
      <!-- Overlay if user has no access -->
      <div
        v-if="!hasAccess"
        class="absolute inset-0 bg-white/80 backdrop-blur-md flex flex-col justify-center items-center text-center px-4 z-10"
      >
        <i class="pi pi-lock text-4xl text-purple-500 mb-3"></i>
        <p class="text-sm text-gray-700">
          This article is for <strong>{{ article.access_tier }}</strong> users
        </p>
        <Button label="Upgrade Tier" icon="pi pi-arrow-up" class="mt-3" severity="secondary" />
      </div>

      <div class="p-4 space-y-2">
        <h3 class="text-lg font-semibold text-gray-800 line-clamp-2">
          {{ article.title }}
        </h3>
        <p class="text-sm text-gray-500 line-clamp-3">{{ previewText }}</p>
        <div class="flex justify-between items-center pt-2 text-xs text-gray-400">
          <span class="italic">Posted on {{ formattedDate }}</span>
          <span
            :class="{
              'text-green-600': article.access_tier === 'free',
              'text-yellow-600': article.access_tier === 'basic',
              'text-red-600': article.access_tier === 'premium',
            }"
          >
            {{ article.access_tier.toUpperCase() }} Tier
          </span>
        </div>
      </div>
    </template>
  </Card>
</template>

<style scoped>
.line-clamp-2 {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
.line-clamp-3 {
  display: -webkit-box;
  -webkit-line-clamp: 3;
  line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
</style>
