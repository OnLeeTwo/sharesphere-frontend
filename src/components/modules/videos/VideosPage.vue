<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useAuthStore } from '@/store/authStore'
import { useToast } from 'primevue/usetoast'
import { Video, Tier } from '@/utils/type'
import { videoService } from '@/services/videosServices'
import { capitalizeFirstLetter } from '@/utils/string'

import Button from 'primevue/button'
import Card from 'primevue/card'
import Badge from 'primevue/badge'
import Skeleton from 'primevue/skeleton'
import Avatar from 'primevue/avatar'
import Divider from 'primevue/divider'

const router = useRouter()
const route = useRoute()
const toast = useToast()
const auth = useAuthStore()

const video = ref<Video | null>(null)
const relatedVideos = ref<Video[]>([])
const loading = ref(true)
const videoPlayer = ref<HTMLVideoElement>()

const userTier = computed(() => auth.userTier || 'free')

onMounted(() => {
  loadVideo()
  loadRelatedVideos()
})

const fetchVideo = async (id: string) => {
  try {
    const response = await videoService.fetchVideoById(id)
    video.value = response
  } catch (error) {
    console.error('Error fetching video:', error)
    toast.add({
      severity: 'error',
      summary: 'Error',
      detail: 'Failed to load video. Please try again.',
      life: 3000,
    })
    router.push('/videos')
  }
}

const fetchRelatedVideos = async () => {
  try {
    const response = await videoService.fetchVideos({
      page: 1,
      per_page: 6,
    })
    relatedVideos.value = response.videos
  } catch (error) {
    console.error('Error fetching related videos:', error)
  }
}

const loadVideo = async () => {
  loading.value = true
  await fetchVideo(route.params.id as string)
  loading.value = false
}

const loadRelatedVideos = async () => {
  await fetchRelatedVideos()
}

const canUserAccessVideo = (videoItem: Video): boolean => {
  const tierHierarchy = { free: 0, basic: 1, premium: 2 }
  const userTierLevel = tierHierarchy[userTier.value as keyof typeof tierHierarchy] || 0
  const videoTierLevel = tierHierarchy[videoItem.access_tier]
  return userTierLevel >= videoTierLevel
}

const getTierColor = (tier: Tier) => {
  switch (tier) {
    case 'free':
      return 'success'
    case 'basic':
      return 'warning'
    case 'premium':
      return 'danger'
    default:
      return 'info'
  }
}

const getTierIcon = (tier: Tier) => {
  switch (tier) {
    case 'free':
      return 'pi pi-unlock'
    case 'basic':
      return 'pi pi-star'
    case 'premium':
      return 'pi pi-crown'
    default:
      return 'pi pi-video'
  }
}

const formatDate = (dateString: string) => {
  const date = new Date(dateString)
  const now = new Date()
  const diffTime = Math.abs(now.getTime() - date.getTime())
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))

  if (diffDays === 1) return 'Yesterday'
  if (diffDays < 7) return `${diffDays} days ago`
  if (diffDays < 30) return `${Math.ceil(diffDays / 7)} weeks ago`
  if (diffDays < 365) return `${Math.ceil(diffDays / 30)} months ago`
  return `${Math.ceil(diffDays / 365)} years ago`
}

const formatViews = (views: number) => {
  if (views < 1000) return views.toString()
  if (views < 1000000) return `${(views / 1000).toFixed(1)}K`
  return `${(views / 1000000).toFixed(1)}M`
}

const goToVideo = (videoItem: Video) => {
  if (!canUserAccessVideo(videoItem)) {
    toast.add({
      severity: 'warn',
      summary: 'Access Restricted',
      detail: `This video requires ${videoItem.access_tier} tier. Upgrade your plan to watch this content.`,
      life: 4000,
    })
    return
  }
  router.push(`/videos/${videoItem.id}`)
}

const goBack = () => {
  router.back()
}

const getUpgradeMessage = (tier: Tier): string => {
  switch (tier) {
    case 'basic':
      return 'Upgrade to Basic to unlock this content'
    case 'premium':
      return 'Upgrade to Premium to unlock this content'
    default:
      return 'This content is not available'
  }
}

const handleUpgrade = () => {
  router.push('/upgrade')
}
</script>

<template>
  <div class="min-h-screen bg-gradient-to-br from-purple-50 via-white to-pink-50 pt-20">
    <div class="max-w-7xl mx-auto px-6 py-8">
      <!-- Back Button -->
      <div class="mb-6">
        <Button
          @click="goBack"
          class="!bg-white !text-purple-600 !border-purple-200 hover:!bg-purple-50 !shadow-md"
          icon="pi pi-arrow-left"
          label="Back to Videos"
        />
      </div>

      <!-- Loading State -->
      <div v-if="loading" class="space-y-6">
        <div class="bg-white rounded-xl shadow-lg p-6">
          <Skeleton height="400px" class="mb-4" />
          <Skeleton height="30px" width="80%" class="mb-2" />
          <Skeleton height="20px" width="60%" class="mb-4" />
          <div class="flex items-center gap-4">
            <Skeleton shape="circle" size="48px" />
            <div class="flex-1">
              <Skeleton height="16px" width="120px" class="mb-1" />
              <Skeleton height="14px" width="80px" />
            </div>
          </div>
        </div>
      </div>

      <!-- Video Content -->
      <div v-else-if="video" class="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <!-- Main Video Section -->
        <div class="lg:col-span-2 space-y-6">
          <!-- Video Player -->
          <Card class="!bg-white !border-0 !shadow-lg !rounded-xl overflow-hidden">
            <template #content>
              <div class="relative">
                <!-- Accessible Video Player -->
                <div v-if="canUserAccessVideo(video)" class="relative">
                  <!-- Video Element (you can replace this with your preferred video player) -->
                  <video
                    ref="videoPlayer"
                    :src="video.video_url"
                    :poster="video.thumbnail_url"
                    controls
                    class="w-full h-auto max-h-[500px] bg-black rounded-lg"
                    preload="metadata"
                  >
                    Your browser does not support the video tag.
                  </video>

                  <!-- Duration Badge -->
                  <div
                    class="absolute top-4 right-4 bg-black bg-opacity-70 text-white px-3 py-1 rounded-lg text-sm"
                  >
                    {{ video.duration }}
                  </div>
                </div>

                <!-- Restricted Access Overlay -->
                <div v-else class="relative">
                  <div class="relative">
                    <img
                      :src="video.thumbnail_url"
                      :alt="video.title"
                      class="w-full h-[400px] object-cover filter blur-md"
                    />
                    <div
                      class="absolute inset-0 bg-gradient-to-t from-black/90 via-black/60 to-black/30 flex flex-col items-center justify-center text-white p-8"
                    >
                      <div class="text-center max-w-md">
                        <i
                          :class="getTierIcon(video.access_tier)"
                          class="text-6xl mb-6 text-yellow-400"
                        ></i>
                        <h2 class="text-3xl font-bold mb-4">
                          {{ video.access_tier.toUpperCase() }} REQUIRED
                        </h2>
                        <p class="text-lg mb-6 opacity-90">
                          {{ getUpgradeMessage(video.access_tier) }}
                        </p>
                        <Button
                          label="Upgrade Now"
                          @click="handleUpgrade"
                          class="!bg-gradient-to-r !from-yellow-500 !to-orange-500 !border-0 hover:!from-yellow-600 hover:!to-orange-600 !text-white !font-semibold !px-8 !py-3 !text-lg"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </template>
          </Card>

          <!-- Video Details -->
          <Card class="!bg-white !border-0 !shadow-lg !rounded-xl">
            <template #content>
              <div class="p-6">
                <!-- Title and Tier Badge -->
                <div class="flex items-start justify-between gap-4 mb-4">
                  <h1 class="text-3xl font-bold text-gray-800 flex items-center gap-3">
                    {{ video.title }}
                    <i
                      v-if="!canUserAccessVideo(video)"
                      class="pi pi-lock text-red-500 text-2xl"
                    ></i>
                  </h1>
                  <Badge
                    :value="capitalizeFirstLetter(video.access_tier)"
                    :severity="getTierColor(video.access_tier)"
                    :class="[
                      '!text-sm !px-3 !py-2',
                      !canUserAccessVideo(video) ? '!bg-red-500 !text-white animate-pulse' : '',
                    ]"
                  >
                    <i :class="getTierIcon(video.access_tier)" class="mr-2"></i>
                    {{ capitalizeFirstLetter(video.access_tier) }}
                  </Badge>
                </div>

                <!-- Video Stats -->
                <div class="flex items-center gap-6 text-gray-600 mb-6">
                  <div class="flex items-center gap-2">
                    <i class="pi pi-eye"></i>
                    <span>{{ formatViews(video.views || 0) }} views</span>
                  </div>
                  <div class="flex items-center gap-2">
                    <i class="pi pi-calendar"></i>
                    <span>{{ formatDate(video.created_at || '') }}</span>
                  </div>
                  <div class="flex items-center gap-2">
                    <i class="pi pi-clock"></i>
                    <span>{{ video.duration }}</span>
                  </div>
                </div>

                <!-- Creator Info -->
                <div
                  class="flex items-center gap-4 mb-6 p-4 bg-gradient-to-r from-purple-50 to-pink-50 rounded-xl"
                >
                  <Avatar
                    :image="video.author?.avatar"
                    :label="video.author?.username?.charAt(0).toUpperCase()"
                    size="large"
                    shape="circle"
                    class="!w-16 !h-16"
                  />
                  <div class="flex-1">
                    <h3 class="font-semibold text-lg text-gray-800">
                      {{ video.author?.username }}
                    </h3>
                    <p class="text-gray-600">Content Creator</p>
                  </div>
                  <Button
                    label="Subscribe"
                    class="!bg-gradient-to-r !from-purple-600 !to-pink-600 !border-0 !text-white hover:!from-purple-700 hover:!to-pink-700"
                    size="small"
                  />
                </div>

                <Divider />

                <!-- Description -->
                <div class="mt-6">
                  <h3 class="text-xl font-semibold text-gray-800 mb-4">Description</h3>
                  <p class="text-gray-600 leading-relaxed whitespace-pre-wrap">
                    {{ video.description }}
                  </p>
                </div>
              </div>
            </template>
          </Card>
        </div>

        <!-- Sidebar - Related Videos -->
        <div class="space-y-6">
          <Card class="!bg-white !border-0 !shadow-lg !rounded-xl">
            <template #header>
              <div class="p-6 pb-0">
                <h2 class="text-xl font-semibold text-gray-800">Related Videos</h2>
              </div>
            </template>
            <template #content>
              <div class="p-6 pt-4 space-y-4">
                <div
                  v-for="relatedVideo in relatedVideos"
                  :key="relatedVideo.id"
                  :class="[
                    'flex gap-3 p-3 rounded-lg cursor-pointer transition-all duration-200',
                    canUserAccessVideo(relatedVideo)
                      ? 'hover:bg-gray-50 hover:shadow-md'
                      : 'opacity-75',
                  ]"
                  @click="goToVideo(relatedVideo)"
                >
                  <div class="relative flex-shrink-0">
                    <img
                      :src="relatedVideo.thumbnail_url"
                      :alt="relatedVideo.title"
                      :class="[
                        'w-32 h-20 object-cover rounded-lg',
                        !canUserAccessVideo(relatedVideo) ? 'filter blur-sm' : '',
                      ]"
                    />
                    <!-- Lock overlay for restricted videos -->
                    <div
                      v-if="!canUserAccessVideo(relatedVideo)"
                      class="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center rounded-lg"
                    >
                      <i class="pi pi-lock text-white text-lg"></i>
                    </div>
                    <!-- Duration badge -->
                    <div
                      class="absolute bottom-1 right-1 bg-black bg-opacity-70 text-white px-1 py-0.5 rounded text-xs"
                    >
                      {{ relatedVideo.duration }}
                    </div>
                    <!-- Tier badge -->
                    <Badge
                      :value="relatedVideo.access_tier.charAt(0).toUpperCase()"
                      :severity="getTierColor(relatedVideo.access_tier)"
                      class="!absolute !top-1 !right-1 !text-xs !w-6 !h-6 !p-0 !flex !items-center !justify-center"
                    />
                  </div>
                  <div class="flex-1 min-w-0">
                    <h4
                      :class="[
                        'font-medium text-sm mb-1 line-clamp-2',
                        canUserAccessVideo(relatedVideo) ? 'text-gray-800' : 'text-gray-500',
                      ]"
                    >
                      {{ relatedVideo.title }}
                      <i
                        v-if="!canUserAccessVideo(relatedVideo)"
                        class="pi pi-lock ml-1 text-red-500 text-xs"
                      ></i>
                    </h4>
                    <p
                      :class="[
                        'text-xs mb-2',
                        canUserAccessVideo(relatedVideo) ? 'text-gray-600' : 'text-gray-400',
                      ]"
                    >
                      {{ relatedVideo.author?.username }}
                    </p>
                    <div
                      :class="[
                        'text-xs',
                        canUserAccessVideo(relatedVideo) ? 'text-gray-500' : 'text-gray-400',
                      ]"
                    >
                      {{ formatViews(relatedVideo.views || 0) }} views
                    </div>
                  </div>
                </div>

                <!-- Show upgrade prompt if there are restricted videos -->
                <div
                  v-if="relatedVideos.some((v) => !canUserAccessVideo(v))"
                  class="mt-6 p-4 bg-gradient-to-r from-yellow-50 to-orange-50 rounded-lg border border-yellow-200"
                >
                  <div class="text-center">
                    <i class="pi pi-star text-yellow-600 text-2xl mb-2 block"></i>
                    <h4 class="font-semibold text-yellow-800 mb-2">Unlock More Content</h4>
                    <p class="text-sm text-yellow-700 mb-3">
                      Upgrade your plan to access premium videos
                    </p>
                    <Button
                      label="Upgrade Now"
                      @click="handleUpgrade"
                      size="small"
                      class="!bg-gradient-to-r !from-yellow-500 !to-orange-500 !border-0 !text-white !font-semibold"
                    />
                  </div>
                </div>
              </div>
            </template>
          </Card>
        </div>
      </div>

      <!-- Error State -->
      <div v-else class="text-center py-16">
        <div
          class="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4"
        >
          <i class="pi pi-exclamation-triangle text-gray-400 text-3xl"></i>
        </div>
        <h3 class="text-xl font-semibold text-gray-800 mb-2">Video not found</h3>
        <p class="text-gray-600 mb-6">
          The video you're looking for doesn't exist or has been removed.
        </p>
        <Button
          label="Back to Videos"
          @click="router.push('/videos')"
          class="!bg-purple-600 !border-purple-600 hover:!bg-purple-700"
        />
      </div>
    </div>
  </div>
</template>

<style scoped>
.line-clamp-2 {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

/* Custom scrollbar for better UX */
::-webkit-scrollbar {
  width: 8px;
}

::-webkit-scrollbar-track {
  background: #f1f1f1;
  border-radius: 4px;
}

::-webkit-scrollbar-thumb {
  background: #c1c1c1;
  border-radius: 4px;
}

::-webkit-scrollbar-thumb:hover {
  background: #a1a1a1;
}

/* Video player styling */
video {
  outline: none;
}

video::-webkit-media-controls-panel {
  background-color: rgba(0, 0, 0, 0.8);
}

/* Responsive adjustments */
@media (max-width: 1024px) {
  .grid-cols-1.lg\:grid-cols-3 {
    grid-template-columns: 1fr;
  }
}
</style>
