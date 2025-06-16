<script setup lang="ts">
import { ref, onMounted, computed, watch } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/store/authStore'
import { useToast } from 'primevue/usetoast'
import { Article, ArticleQueryParams, Tier } from '@/utils/type'
import { articleService } from '@/services/articlesService'
import { capitalizeFirstLetter } from '@/utils/string'

import Button from 'primevue/button'
import InputText from 'primevue/inputtext'
import Dropdown from 'primevue/dropdown'
import Skeleton from 'primevue/skeleton'
import Card from 'primevue/card'
import Badge from 'primevue/badge'
import Paginator from 'primevue/paginator'

onMounted(() => {
  loadArticles()
})

const router = useRouter()
const toast = useToast()
const auth = useAuthStore()

const articles = ref<Article[]>([])
const loading = ref(false)
const searchQuery = ref('')
const sortBy = ref('created_at')
const sortOrder = ref('desc')
const accessTierFilter = ref('all')
const categoryFilter = ref('all')
const currentPage = ref(1)
const totalRecords = ref(0)
const perPage = ref(12)
const selectedView = ref('grid')

const userTier = computed(() => auth.userTier || 'free')

// Mock API function for articles
const fetchArticles = async (params: ArticleQueryParams) => {
  loading.value = true
  try {
    const response = await articleService.fetchArticles(params)

    articles.value = response.articles
    totalRecords.value = response.total
    currentPage.value = response.page
  } catch (error) {
    console.error(error)
    toast.add({
      severity: 'error',
      summary: 'Error',
      detail: 'Failed to load articles. Please try again.',
      life: 3000,
    })
  } finally {
    loading.value = false
  }
}
// Computed properties
const sortOptions = [
  { label: 'Newest First', value: 'created_at' },
  { label: 'Oldest First', value: 'created_at_asc' },
  { label: 'Most Read', value: 'views' },
  { label: 'Title A-Z', value: 'title' },
  { label: 'Title Z-A', value: 'title_desc' },
]

const accessTierOptions = [
  { label: 'All Articles', value: 'all' },
  { label: 'Free', value: 'free' },
  { label: 'Basic', value: 'basic' },
  { label: 'Premium', value: 'premium' },
]

const categoryOptions = [
  { label: 'All Categories', value: 'all' },
  { label: 'Technology', value: 'Technology' },
  { label: 'Health', value: 'Health' },
  { label: 'Business', value: 'Business' },
  { label: 'Travel', value: 'Travel' },
  { label: 'Lifestyle', value: 'Lifestyle' },
  { label: 'Education', value: 'Education' },
  { label: 'Science', value: 'Science' },
  { label: 'Arts', value: 'Arts' },
]

const viewOptions = [
  { label: 'Grid', value: 'grid', icon: 'pi pi-th-large' },
  { label: 'List', value: 'list', icon: 'pi pi-list' },
]

// Methods
const loadArticles = () => {
  const params = {
    page: currentPage.value,
    per_page: perPage.value,
    search: searchQuery.value || undefined,
    sort_by: sortBy.value,
    sort_order: sortOrder.value,
    access_tier: accessTierFilter.value !== 'all' ? accessTierFilter.value : undefined,
    category: categoryFilter.value !== 'all' ? categoryFilter.value : undefined,
  }
  fetchArticles(params)
}

const onPageChange = (event: any) => {
  currentPage.value = event.page + 1
  loadArticles()
}

const onSearch = () => {
  currentPage.value = 1
  loadArticles()
}

const onSortChange = () => {
  currentPage.value = 1
  loadArticles()
}

const onFilterChange = () => {
  currentPage.value = 1
  loadArticles()
}

const readArticle = (article: Article) => {
  if (!canUserAccessArticle(article)) {
    toast.add({
      severity: 'warn',
      summary: 'Access Restricted',
      detail: `This article requires ${article.access_tier} tier. Upgrade your plan to read this content.`,
      life: 4000,
    })
    return
  }
  router.push(`/articles/${article.id}`)
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
const canUserAccessArticle = (article: Article): boolean => {
  const tierHierarchy = { free: 0, basic: 1, premium: 2 }
  const userTierLevel = tierHierarchy[userTier.value as keyof typeof tierHierarchy] || 0
  const articleTierLevel = tierHierarchy[article.access_tier]
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

// Watchers
watch(searchQuery, () => {
  // Debounce search
  clearTimeout(searchTimeout)
  searchTimeout = setTimeout(() => {
    onSearch()
  }, 500)
})

let searchTimeout: ReturnType<typeof setTimeout>
</script>

<template>
  <div class="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 pt-20">
    <div class="max-w-7xl mx-auto px-6 py-8">
      <!-- Header Section -->
      <div class="mb-8">
        <div class="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
          <div>
            <h1
              class="text-4xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent mb-2"
            >
              Article Explorer
            </h1>
            <p class="text-gray-600 text-lg">Discover insightful articles from expert writers</p>
          </div>

          <!-- Quick Stats -->
          <div class="flex items-center gap-6 bg-white rounded-xl p-4 shadow-md">
            <div class="text-center">
              <div class="text-2xl font-bold text-blue-600">{{ totalRecords }}</div>
              <div class="text-sm text-gray-500">Total Articles</div>
            </div>
            <div class="w-px h-8 bg-gray-200"></div>
            <div class="text-center">
              <div class="text-2xl font-bold text-indigo-600">
                {{ Math.ceil(totalRecords / perPage) }}
              </div>
              <div class="text-sm text-gray-500">Pages</div>
            </div>
          </div>
        </div>
      </div>

      <!-- Filters and Search -->
      <div class="bg-white rounded-xl shadow-lg p-6 mb-8">
        <div class="flex flex-col lg:flex-row gap-4 items-center">
          <!-- Search -->
          <div class="flex-1 relative">
            <i
              class="pi pi-search absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
            ></i>
            <InputText
              v-model="searchQuery"
              placeholder="Search articles by title, content, or author..."
              class="!pl-10 !pr-4 !py-3 !w-full !border-gray-200 !rounded-lg focus:!border-blue-500 focus:!ring-2 focus:!ring-blue-200"
            />
          </div>

          <!-- Filters -->
          <div class="flex items-center gap-4">
            <Dropdown
              v-model="sortBy"
              :options="sortOptions"
              optionLabel="label"
              optionValue="value"
              placeholder="Sort by"
              @change="onSortChange"
              class="!min-w-[150px]"
            />

            <Dropdown
              v-model="categoryFilter"
              :options="categoryOptions"
              optionLabel="label"
              optionValue="value"
              @change="onFilterChange"
              class="!min-w-[140px]"
            />

            <Dropdown
              v-model="accessTierFilter"
              :options="accessTierOptions"
              optionLabel="label"
              optionValue="value"
              @change="onFilterChange"
              class="!min-w-[120px]"
            />

            <!-- View Toggle -->
            <div class="flex bg-gray-100 rounded-lg p-1">
              <Button
                v-for="option in viewOptions"
                :key="option.value"
                :class="[
                  '!px-3 !py-2 !text-sm !border-0 !transition-all !duration-200',
                  selectedView === option.value
                    ? '!bg-white !text-blue-600 shadow-sm'
                    : '!bg-transparent !text-gray-600 hover:!text-blue-600',
                ]"
                :icon="option.icon"
                @click="selectedView = option.value"
              />
            </div>
          </div>
        </div>
      </div>

      <!-- Loading State -->
      <div
        v-if="loading"
        class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
      >
        <div v-for="i in 8" :key="i" class="bg-white rounded-xl shadow-md overflow-hidden">
          <Skeleton height="200px" />
          <div class="p-4">
            <Skeleton height="20px" class="mb-2" />
            <Skeleton height="16px" width="60%" class="mb-2" />
            <Skeleton height="14px" class="mb-3" />
            <div class="flex items-center gap-2">
              <Skeleton shape="circle" size="32px" />
              <Skeleton height="14px" width="80px" />
            </div>
          </div>
        </div>
      </div>

      <!-- Articles Grid/List -->
      <div v-else-if="articles.length > 0">
        <!-- Grid View -->
        <div
          v-if="selectedView === 'grid'"
          class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-8"
        >
          <Card
            v-for="article in articles"
            :key="article.id"
            :class="[
              '!bg-white !border-0 !shadow-md hover:!shadow-xl !transition-all !duration-300 cursor-pointer group !overflow-hidden !rounded-xl',
              canUserAccessArticle(article) ? 'hover:!scale-105' : 'opacity-90',
            ]"
            @click="readArticle(article)"
          >
            <template #header>
              <div class="relative overflow-hidden">
                <img
                  :src="article.cover_image_url"
                  :alt="article.title"
                  :class="[
                    'w-full h-48 object-cover transition-transform duration-300',
                    canUserAccessArticle(article) ? 'group-hover:scale-110' : 'filter blur-sm',
                  ]"
                />

                <!-- Access Overlay for Restricted Content -->
                <div
                  v-if="!canUserAccessArticle(article)"
                  class="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent flex flex-col items-center justify-center text-white p-4"
                >
                  <div class="text-center">
                    <i
                      :class="getTierIcon(article.access_tier)"
                      class="text-4xl mb-3 text-yellow-400"
                    ></i>
                    <h4 class="font-semibold text-lg mb-2">
                      {{ article.access_tier.toUpperCase() }} REQUIRED
                    </h4>
                    <p class="text-sm mb-4 opacity-90">
                      {{ getUpgradeMessage(article.access_tier) }}
                    </p>
                    <Button
                      label="Upgrade Now"
                      size="small"
                      class="!bg-gradient-to-r !from-yellow-500 !to-orange-500 !border-0 hover:!from-yellow-600 hover:!to-orange-600 !text-white !font-semibold !px-4 !py-2"
                      @click.stop="router.push('/upgrade')"
                    />
                  </div>
                </div>

                <!-- Read Button for Accessible Content -->
                <div
                  v-else
                  class="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 transition-all duration-300 flex items-center justify-center"
                >
                  <div
                    class="w-16 h-16 bg-white bg-opacity-90 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                  >
                    <i class="pi pi-book text-blue-600 text-xl"></i>
                  </div>
                </div>

                <!-- Read Time -->
                <div
                  class="absolute bottom-2 right-2 bg-black bg-opacity-70 text-white px-2 py-1 rounded text-xs"
                >
                  {{ article.read_time }}
                </div>

                <!-- Access Tier Badge -->
                <Badge
                  :value="article.access_tier"
                  :severity="getTierColor(article.access_tier)"
                  :class="[
                    'absolute top-2 right-2 !text-xs !px-2 !py-1',
                    !canUserAccessArticle(article) ? '!bg-red-500 !text-white animate-pulse' : '',
                  ]"
                >
                  <i :class="getTierIcon(article.access_tier)" class="mr-1"></i>
                  {{ capitalizeFirstLetter(article.access_tier) }}
                </Badge>

                <!-- Category Badge -->
                <Badge
                  :value="article.category"
                  :severity="getCategoryColor(article.category)"
                  class="absolute top-2 left-2 !text-xs !px-2 !py-1"
                />
              </div>
            </template>

            <template #content>
              <div class="p-4">
                <h3
                  :class="[
                    'font-semibold mb-2 line-clamp-2 transition-colors',
                    canUserAccessArticle(article)
                      ? 'text-gray-800 group-hover:text-blue-600'
                      : 'text-gray-500',
                  ]"
                >
                  {{ article.title }}
                  <i v-if="!canUserAccessArticle(article)" class="pi pi-lock ml-2 text-red-500"></i>
                </h3>

                <p
                  :class="[
                    'text-sm mb-3 line-clamp-2',
                    canUserAccessArticle(article) ? 'text-gray-600' : 'text-gray-400',
                  ]"
                >
                  {{ article.description }}
                </p>

                <div class="flex items-center justify-between">
                  <div class="flex items-center gap-2">
                    <img
                      :src="article.author?.avatar"
                      :alt="article.author?.username"
                      class="w-8 h-8 rounded-full"
                    />
                    <span
                      :class="[
                        'text-sm',
                        canUserAccessArticle(article) ? 'text-gray-600' : 'text-gray-400',
                      ]"
                      >{{ article.author?.username }}</span
                    >
                  </div>

                  <div
                    :class="[
                      'text-xs',
                      canUserAccessArticle(article) ? 'text-gray-500' : 'text-gray-400',
                    ]"
                  >
                    {{ formatViews(article.views || 0) }} views
                  </div>
                </div>

                <div
                  :class="[
                    'mt-2 text-xs',
                    canUserAccessArticle(article) ? 'text-gray-400' : 'text-gray-300',
                  ]"
                >
                  {{ formatDate(article.created_at || '') }}
                </div>
              </div>
            </template>
          </Card>
        </div>

        <!-- List View -->
        <div v-else class="space-y-4 mb-8">
          <Card
            v-for="article in articles"
            :key="article.id"
            :class="[
              '!bg-white !border-0 !shadow-md hover:!shadow-lg !transition-all !duration-300 cursor-pointer !rounded-xl',
              !canUserAccessArticle(article) ? 'opacity-90' : '',
            ]"
            @click="readArticle(article)"
          >
            <template #content>
              <div class="flex gap-4 p-4">
                <div class="relative flex-shrink-0">
                  <img
                    :src="article.cover_image_url"
                    :alt="article.title"
                    :class="[
                      'w-48 h-32 object-cover rounded-lg',
                      !canUserAccessArticle(article) ? 'filter blur-sm' : '',
                    ]"
                  />

                  <!-- Access Overlay for List View -->
                  <div
                    v-if="!canUserAccessArticle(article)"
                    class="absolute inset-0 bg-gradient-to-r from-black/70 to-black/40 flex items-center justify-center rounded-lg"
                  >
                    <div class="text-center text-white">
                      <i
                        :class="getTierIcon(article.access_tier)"
                        class="text-2xl mb-2 text-yellow-400"
                      ></i>
                      <div class="text-xs font-semibold">
                        {{ article.access_tier.toUpperCase() }}
                      </div>
                      <div class="text-xs opacity-90">REQUIRED</div>
                    </div>
                  </div>

                  <!-- Read Time Badge -->
                  <div
                    class="absolute bottom-2 right-2 bg-black bg-opacity-70 text-white px-2 py-1 rounded text-xs"
                  >
                    {{ article.read_time }}
                  </div>
                </div>

                <div class="flex-1 min-w-0">
                  <div class="flex items-start justify-between gap-4">
                    <div class="flex-1">
                      <div class="flex items-center gap-2 mb-2">
                        <Badge
                          :value="article.category"
                          :severity="getCategoryColor(article.category)"
                          class="!text-xs !px-2 !py-1"
                        />
                        <Badge
                          :value="article.access_tier"
                          :severity="getTierColor(article.access_tier)"
                          :class="[
                            '!text-xs !px-2 !py-1',
                            !canUserAccessArticle(article)
                              ? '!bg-red-500 !text-white animate-pulse'
                              : '',
                          ]"
                        >
                          <i :class="getTierIcon(article.access_tier)" class="mr-1"></i>
                          {{ capitalizeFirstLetter(article.access_tier) }}
                        </Badge>
                      </div>

                      <h3
                        :class="[
                          'font-semibold mb-2 text-lg flex items-center gap-2',
                          canUserAccessArticle(article) ? 'text-gray-800' : 'text-gray-500',
                        ]"
                      >
                        {{ article.title }}
                        <i
                          v-if="!canUserAccessArticle(article)"
                          class="pi pi-lock text-red-500 text-sm"
                        ></i>
                      </h3>

                      <p
                        :class="[
                          'mb-3 line-clamp-2',
                          canUserAccessArticle(article) ? 'text-gray-600' : 'text-gray-400',
                        ]"
                      >
                        {{ article.content_preview }}
                      </p>

                      <div class="flex items-center gap-4 text-sm">
                        <div class="flex items-center gap-2">
                          <img
                            :src="article.author?.avatar"
                            :alt="article.author?.username"
                            class="w-6 h-6 rounded-full"
                          />
                          <span
                            :class="
                              canUserAccessArticle(article) ? 'text-gray-500' : 'text-gray-400'
                            "
                          >
                            {{ article.author?.username }}
                          </span>
                        </div>

                        <span
                          :class="canUserAccessArticle(article) ? 'text-gray-500' : 'text-gray-400'"
                        >
                          {{ formatViews(article.views || 0) }} views
                        </span>
                        <span
                          :class="canUserAccessArticle(article) ? 'text-gray-500' : 'text-gray-400'"
                        >
                          {{ formatDate(article.created_at || '') }}
                        </span>
                        <span
                          :class="canUserAccessArticle(article) ? 'text-gray-500' : 'text-gray-400'"
                        >
                          {{ article.read_time }}
                        </span>
                      </div>

                      <!-- Upgrade prompt for restricted content in list view -->
                      <div
                        v-if="!canUserAccessArticle(article)"
                        class="mt-3 p-3 bg-gradient-to-r from-yellow-50 to-orange-50 rounded-lg border border-yellow-200"
                      >
                        <div class="flex items-center justify-between">
                          <div class="flex items-center gap-2">
                            <i class="pi pi-exclamation-triangle text-yellow-600"></i>
                            <span class="text-sm text-yellow-800 font-medium">
                              {{ getUpgradeMessage(article.access_tier) }}
                            </span>
                          </div>
                          <Button
                            label="Upgrade"
                            size="small"
                            class="!bg-gradient-to-r !from-yellow-500 !to-orange-500 !border-0 !text-white !text-xs !px-3 !py-1"
                            @click.stop="router.push('/upgrade')"
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </template>
          </Card>
        </div>

        <!-- Pagination -->
        <div class="flex justify-center">
          <Paginator
            :rows="perPage"
            :totalRecords="totalRecords"
            :first="(currentPage - 1) * perPage"
            @page="onPageChange"
            class="!bg-white !border-0 !rounded-xl !shadow-md"
          />
        </div>
      </div>

      <!-- Empty State -->
      <div v-else class="text-center py-16">
        <div
          class="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4"
        >
          <i class="pi pi-file-text text-gray-400 text-3xl"></i>
        </div>
        <h3 class="text-xl font-semibold text-gray-800 mb-2">No articles found</h3>
        <p class="text-gray-600 mb-6">
          {{
            searchQuery
              ? 'Try adjusting your search terms or filters'
              : 'No articles available at the moment'
          }}
        </p>
        <Button
          label="Clear Filters"
          @click="
            () => {
              searchQuery = ''
              accessTierFilter = 'all'
              categoryFilter = 'all'
              onSearch()
            }
          "
          class="!bg-blue-600 !border-blue-600 hover:!bg-blue-700"
          v-if="searchQuery || accessTierFilter !== 'all' || categoryFilter !== 'all'"
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
</style>
