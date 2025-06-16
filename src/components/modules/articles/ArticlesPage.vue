<script setup lang="ts">
import { ref, onMounted, computed, onBeforeUnmount } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useAuthStore } from '@/store/authStore'
import { useToast } from 'primevue/usetoast'
import { Article, Tier } from '@/utils/type'
import { articleService } from '@/services/articlesService'
import { capitalizeFirstLetter } from '@/utils/string'
import { useProgressStore } from '@/store/progressStore'

import Button from 'primevue/button'
import Card from 'primevue/card'
import Badge from 'primevue/badge'
import Skeleton from 'primevue/skeleton'
import ScrollTop from 'primevue/scrolltop'

const route = useRoute()
const router = useRouter()
const toast = useToast()
const auth = useAuthStore()
const progressStore = useProgressStore()

const articleId = route.params.id as string

const article = ref<Article | null>(null)
const relatedArticles = ref<Article[]>([])
const loading = ref(false)
const relatedLoading = ref(false)
const readingProgress = ref(0)

const userTier = computed(() => auth.userTier || 'free')

// Save progress before leaving
onBeforeUnmount(() => {
  progressStore.saveProgress(articleId, window.scrollY)
})

// Restore progress on mount
onMounted(() => {
  const saved = progressStore.getProgress(articleId)
  window.scrollTo(0, saved)
})

onMounted(() => {
  loadArticle()
  setupScrollProgress()
})

// Mock API function for single article
const fetchArticle = async (id: string) => {
  loading.value = true
  try {
    const response = await articleService.fetchArticleById(id)
    article.value = response

    // Load related articles
    loadRelatedArticles()
  } catch (error) {
    console.error(error)
    toast.add({
      severity: 'error',
      summary: 'Error',
      detail: 'Failed to load article. Please try again.',
      life: 3000,
    })
    router.push('/articles')
  } finally {
    loading.value = false
  }
}

const fetchRelatedArticles = async (category: string) => {
  relatedLoading.value = true
  try {
    const response = await articleService.fetchArticles({
      category,
      per_page: 4,
    })
    relatedArticles.value = response.articles
  } catch (error) {
    console.error(error)
  } finally {
    relatedLoading.value = false
  }
}

const loadArticle = () => {
  fetchArticle(articleId)
}

const loadRelatedArticles = () => {
  if (article.value) {
    fetchRelatedArticles(article.value.category)
  }
}

const setupScrollProgress = () => {
  window.addEventListener('scroll', updateReadingProgress)
}

const updateReadingProgress = () => {
  const winScroll = document.body.scrollTop || document.documentElement.scrollTop
  const height = document.documentElement.scrollHeight - document.documentElement.clientHeight
  const scrolled = (winScroll / height) * 100
  readingProgress.value = Math.min(scrolled, 100)
}

const formatDate = (dateString: string) => {
  const date = new Date(dateString)
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })
}

const formatViews = (views: number) => {
  if (views < 1000) return views.toString()
  if (views < 1000000) return `${(views / 1000).toFixed(1)}K`
  return `${(views / 1000000).toFixed(1)}M`
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
      return 'pi pi-file-text'
  }
}

const getCategoryColor = (category: string) => {
  const colors = {
    Technology: 'info',
    Health: 'success',
    Business: 'warning',
    Travel: 'help',
    Lifestyle: 'secondary',
    Education: 'contrast',
    Science: 'info',
    Arts: 'danger',
  }
  return colors[category as keyof typeof colors] || 'info'
}

// Check if user can access article based on tier hierarchy
const canUserAccessArticle = (targetArticle: Article): boolean => {
  const tierHierarchy = { free: 0, basic: 1, premium: 2 }
  const userTierLevel = tierHierarchy[userTier.value as keyof typeof tierHierarchy] || 0
  const articleTierLevel = tierHierarchy[targetArticle.access_tier]
  return userTierLevel >= articleTierLevel
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

const readRelatedArticle = (targetArticle: Article) => {
  if (!canUserAccessArticle(targetArticle)) {
    toast.add({
      severity: 'warn',
      summary: 'Access Restricted',
      detail: `This article requires ${targetArticle.access_tier} tier. Upgrade your plan to read this content.`,
      life: 4000,
    })
    return
  }
  router.push(`/articles/${targetArticle.id}`)
}

const shareArticle = () => {
  if (navigator.share) {
    navigator.share({
      title: article.value?.title,
      text: article.value?.description,
      url: window.location.href,
    })
  } else {
    navigator.clipboard.writeText(window.location.href)
    toast.add({
      severity: 'success',
      summary: 'Link Copied',
      detail: 'Article link copied to clipboard',
      life: 3000,
    })
  }
}

const goBack = () => {
  router.push('/articles')
}
</script>

<template>
  <div class="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50">
    <!-- Reading Progress Bar -->
    <div class="fixed top-0 left-0 w-full h-1 bg-gray-200 z-50">
      <div
        class="h-full bg-gradient-to-r from-blue-600 to-indigo-600 transition-all duration-150 ease-out"
        :style="{ width: `${readingProgress}%` }"
      ></div>
    </div>

    <!-- Loading State -->
    <div v-if="loading" class="pt-20 px-6">
      <div class="max-w-4xl mx-auto">
        <!-- Header Skeleton -->
        <div class="mb-8">
          <Skeleton height="2rem" width="100px" class="mb-4" />
          <Skeleton height="3rem" class="mb-4" />
          <Skeleton height="1.5rem" width="70%" class="mb-6" />
          <div class="flex items-center gap-4 mb-4">
            <Skeleton shape="circle" size="48px" />
            <div>
              <Skeleton height="1rem" width="120px" class="mb-2" />
              <Skeleton height="0.875rem" width="80px" />
            </div>
          </div>
        </div>

        <!-- Image Skeleton -->
        <Skeleton height="400px" class="mb-8 rounded-xl" />

        <!-- Content Skeleton -->
        <div class="space-y-4">
          <Skeleton height="1rem" v-for="i in 8" :key="i" />
        </div>
      </div>
    </div>

    <!-- Article Content -->
    <div v-else-if="article" class="pt-20 px-6 pb-12">
      <div class="max-w-4xl mx-auto">
        <!-- Back Button -->
        <Button
          @click="goBack"
          class="!bg-white !text-gray-600 !border-gray-200 hover:!bg-gray-50 !mb-6 !shadow-md"
          icon="pi pi-arrow-left"
          label="Back to Articles"
        />

        <!-- Article Header -->
        <div class="mb-8">
          <!-- Badges -->
          <div class="flex items-center gap-3 mb-4">
            <Badge
              :value="article.category"
              :severity="getCategoryColor(article.category)"
              class="!text-sm !px-3 !py-1"
            />
            <Badge
              :value="article.access_tier"
              :severity="getTierColor(article.access_tier)"
              class="!text-sm !px-3 !py-1"
            >
              <i :class="getTierIcon(article.access_tier)" class="mr-1"></i>
              {{ capitalizeFirstLetter(article.access_tier) }}
            </Badge>
            <span class="text-sm text-gray-500">{{ article.read_time }}</span>
            <span class="text-sm text-gray-500">{{ formatViews(article.views || 0) }} views</span>
          </div>

          <!-- Title -->
          <h1 class="text-4xl md:text-5xl font-bold text-gray-800 mb-4 leading-tight">
            {{ article.title }}
          </h1>

          <!-- Description -->
          <p class="text-xl text-gray-600 mb-6 leading-relaxed">
            {{ article.description }}
          </p>

          <!-- Author Info -->
          <div class="flex items-center justify-between">
            <div class="flex items-center gap-4">
              <img
                :src="article.author?.avatar"
                :alt="article.author?.username"
                class="w-12 h-12 rounded-full"
              />
              <div>
                <h3 class="font-semibold text-gray-800">{{ article.author?.username }}</h3>
                <p class="text-sm text-gray-600">{{ formatDate(article.created_at || '') }}</p>
              </div>
            </div>

            <!-- Share Button -->
            <Button
              @click="shareArticle"
              class="!bg-blue-600 !border-blue-600 hover:!bg-blue-700"
              icon="pi pi-share-alt"
              label="Share"
            />
          </div>
        </div>

        <!-- Access Control -->
        <div v-if="!canUserAccessArticle(article)" class="mb-8">
          <Card
            class="!bg-gradient-to-r !from-yellow-50 !to-orange-50 !border-yellow-200 !shadow-lg"
          >
            <template #content>
              <div class="text-center p-8">
                <i
                  :class="getTierIcon(article.access_tier)"
                  class="text-6xl text-yellow-500 mb-4"
                ></i>
                <h2 class="text-2xl font-bold text-gray-800 mb-2">
                  {{ article.access_tier.toUpperCase() }} TIER REQUIRED
                </h2>
                <p class="text-gray-600 mb-6 text-lg">
                  {{ getUpgradeMessage(article.access_tier) }} to continue reading this article.
                </p>
                <Button
                  label="Upgrade Now"
                  @click="router.push('/upgrade')"
                  class="!bg-gradient-to-r !from-yellow-500 !to-orange-500 !border-0 hover:!from-yellow-600 hover:!to-orange-600 !text-white !font-semibold !px-6 !py-3 !text-lg"
                />
              </div>
            </template>
          </Card>
        </div>

        <!-- Article Cover Image -->
        <div class="mb-8 relative overflow-hidden rounded-xl shadow-lg">
          <img
            :src="article.cover_image_url"
            :alt="article.title"
            :class="[
              'w-full h-96 object-cover',
              !canUserAccessArticle(article) ? 'filter blur-md' : '',
            ]"
          />

          <!-- Blur overlay for restricted content -->
          <div
            v-if="!canUserAccessArticle(article)"
            class="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/20 flex items-center justify-center"
          >
            <div class="text-white text-center">
              <i class="pi pi-lock text-4xl mb-2"></i>
              <p class="text-lg font-semibold">Premium Content</p>
            </div>
          </div>
        </div>

        <!-- Article Content -->
        <div v-if="canUserAccessArticle(article)">
          <Card class="!bg-white !border-0 !shadow-lg !mb-8">
            <template #content>
              <div class="prose prose-lg max-w-none p-6">
                <!-- This would contain the actual article content -->
                <!-- For demo purposes, using placeholder content -->
                <div
                  v-html="article.content || article.content_preview"
                  class="text-gray-800 leading-relaxed"
                ></div>

                <!-- If no content, show preview -->
                <div v-if="!article.content" class="space-y-4 text-gray-800 leading-relaxed">
                  <p>{{ article.content_preview }}</p>
                  <p>
                    Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor
                    incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis
                    nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.
                  </p>
                  <p>
                    Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu
                    fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in
                    culpa qui officia deserunt mollit anim id est laborum.
                  </p>
                  <p>
                    Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium
                    doloremque laudantium, totam rem aperiam, eaque ipsa quae ab illo inventore
                    veritatis et quasi architecto beatae vitae dicta sunt explicabo.
                  </p>
                </div>
              </div>
            </template>
          </Card>

          <!-- Article Actions -->
          <div class="flex items-center justify-center gap-4 mb-12">
            <Button
              @click="shareArticle"
              class="!bg-blue-600 !border-blue-600 hover:!bg-blue-700"
              icon="pi pi-share-alt"
              label="Share Article"
            />
            <Button
              @click="goBack"
              class="!bg-gray-600 !border-gray-600 hover:!bg-gray-700"
              icon="pi pi-list"
              label="More Articles"
            />
          </div>
        </div>

        <!-- Related Articles -->
        <div class="mt-12">
          <h2 class="text-3xl font-bold text-gray-800 mb-8 text-center">Related Articles</h2>

          <!-- Loading Related Articles -->
          <div v-if="relatedLoading" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6">
            <div v-for="i in 4" :key="i" class="bg-white rounded-xl shadow-md overflow-hidden">
              <Skeleton height="200px" />
              <div class="p-4">
                <Skeleton height="20px" class="mb-2" />
                <Skeleton height="16px" width="60%" class="mb-2" />
                <Skeleton height="14px" class="mb-3" />
              </div>
            </div>
          </div>

          <!-- Related Articles Grid -->
          <div v-else-if="relatedArticles.length > 0" class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card
              v-for="relatedArticle in relatedArticles"
              :key="relatedArticle.id"
              :class="[
                '!bg-white !border-0 !shadow-md hover:!shadow-xl !transition-all !duration-300 cursor-pointer group !overflow-hidden !rounded-xl',
                canUserAccessArticle(relatedArticle) ? 'hover:!scale-105' : 'opacity-90',
              ]"
              @click="readRelatedArticle(relatedArticle)"
            >
              <template #header>
                <div class="relative overflow-hidden">
                  <img
                    :src="relatedArticle.cover_image_url"
                    :alt="relatedArticle.title"
                    :class="[
                      'w-full h-48 object-cover transition-transform duration-300',
                      canUserAccessArticle(relatedArticle)
                        ? 'group-hover:scale-110'
                        : 'filter blur-sm',
                    ]"
                  />

                  <!-- Access Overlay for Restricted Content -->
                  <div
                    v-if="!canUserAccessArticle(relatedArticle)"
                    class="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent flex flex-col items-center justify-center text-white p-4"
                  >
                    <div class="text-center">
                      <i
                        :class="getTierIcon(relatedArticle.access_tier)"
                        class="text-3xl mb-2 text-yellow-400"
                      ></i>
                      <h4 class="font-semibold text-sm mb-1">
                        {{ relatedArticle.access_tier.toUpperCase() }} REQUIRED
                      </h4>
                    </div>
                  </div>

                  <!-- Read Time -->
                  <div
                    class="absolute bottom-2 right-2 bg-black bg-opacity-70 text-white px-2 py-1 rounded text-xs"
                  >
                    {{ relatedArticle.read_time }}
                  </div>

                  <!-- Access Tier Badge -->
                  <Badge
                    :value="relatedArticle.access_tier"
                    :severity="getTierColor(relatedArticle.access_tier)"
                    :class="[
                      'absolute top-2 right-2 !text-xs !px-2 !py-1',
                      !canUserAccessArticle(relatedArticle)
                        ? '!bg-red-500 !text-white animate-pulse'
                        : '',
                    ]"
                  >
                    <i :class="getTierIcon(relatedArticle.access_tier)" class="mr-1"></i>
                    {{ capitalizeFirstLetter(relatedArticle.access_tier) }}
                  </Badge>

                  <!-- Category Badge -->
                  <Badge
                    :value="relatedArticle.category"
                    :severity="getCategoryColor(relatedArticle.category)"
                    class="absolute top-2 left-2 !text-xs !px-2 !py-1"
                  />
                </div>
              </template>

              <template #content>
                <div class="p-4">
                  <h3
                    :class="[
                      'font-semibold mb-2 line-clamp-2 transition-colors',
                      canUserAccessArticle(relatedArticle)
                        ? 'text-gray-800 group-hover:text-blue-600'
                        : 'text-gray-500',
                    ]"
                  >
                    {{ relatedArticle.title }}
                    <i
                      v-if="!canUserAccessArticle(relatedArticle)"
                      class="pi pi-lock ml-2 text-red-500 text-sm"
                    ></i>
                  </h3>

                  <p
                    :class="[
                      'text-sm mb-3 line-clamp-2',
                      canUserAccessArticle(relatedArticle) ? 'text-gray-600' : 'text-gray-400',
                    ]"
                  >
                    {{ relatedArticle.description }}
                  </p>

                  <div class="flex items-center justify-between text-xs text-gray-500">
                    <span>{{ relatedArticle.author?.username }}</span>
                    <span>{{ formatViews(relatedArticle.views || 0) }} views</span>
                  </div>
                </div>
              </template>
            </Card>
          </div>

          <!-- No Related Articles -->
          <div v-else class="text-center py-8">
            <div
              class="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4"
            >
              <i class="pi pi-file-text text-gray-400 text-2xl"></i>
            </div>
            <p class="text-gray-600">No related articles found</p>
          </div>
        </div>
      </div>
    </div>

    <!-- Error State -->
    <div v-else class="pt-20 px-6">
      <div class="max-w-4xl mx-auto text-center py-16">
        <div
          class="w-24 h-24 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4"
        >
          <i class="pi pi-exclamation-triangle text-red-500 text-3xl"></i>
        </div>
        <h2 class="text-2xl font-semibold text-gray-800 mb-2">Article Not Found</h2>
        <p class="text-gray-600 mb-6">
          The article you're looking for doesn't exist or has been removed.
        </p>
        <Button
          @click="goBack"
          class="!bg-blue-600 !border-blue-600 hover:!bg-blue-700"
          icon="pi pi-arrow-left"
          label="Back to Articles"
        />
      </div>
    </div>

    <!-- Scroll to Top -->
    <ScrollTop />
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

.prose {
  font-size: 1.125rem;
  line-height: 1.75;
}

.prose p {
  margin-bottom: 1.5rem;
}

.prose h2 {
  font-size: 1.5rem;
  font-weight: 600;
  margin-top: 2rem;
  margin-bottom: 1rem;
  color: #1f2937;
}

.prose h3 {
  font-size: 1.25rem;
  font-weight: 600;
  margin-top: 1.5rem;
  margin-bottom: 0.75rem;
  color: #374151;
}

/* Custom scrollbar */
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
</style>
