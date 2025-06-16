<script setup lang="ts">
import { useAuthStore } from '@/store/authStore'
import { useRouter } from 'vue-router'
import Button from 'primevue/button'
import Avatar from 'primevue/avatar'
import Menu from 'primevue/menu'
import { onMounted, ref, computed } from 'vue'

onMounted(() => {
  if (!auth.user?.avatar) {
    auth.fetchUserProfile()
  }
})

const auth = useAuthStore()
const router = useRouter()
const videosMenu = ref()
const articlesMenu = ref()
const userMenu = ref()

const logout = () => {
  auth.logout()
  router.push('/login')
}

// Computed property for tier styling
const tierConfig = computed(() => {
  const tier = auth.user?.tier || 'free'

  switch (tier) {
    case 'premium':
      return {
        label: 'Premium',
        class: 'bg-gradient-to-r from-yellow-400 to-orange-500 text-white',
        icon: 'pi pi-crown',
        badgeClass: 'bg-yellow-500',
      }
    case 'basic':
      return {
        label: 'Basic',
        class: 'bg-gradient-to-r from-blue-400 to-blue-600 text-white',
        icon: 'pi pi-star',
        badgeClass: 'bg-blue-500',
      }
    default:
      return {
        label: 'Free',
        class: 'bg-gradient-to-r from-gray-400 to-gray-600 text-white',
        icon: 'pi pi-user',
        badgeClass: 'bg-gray-500',
      }
  }
})

const videosMenuItems = ref([
  {
    label: 'Browse Videos',
    icon: 'pi pi-play',
    command: () => router.push('/videos'),
  },
  {
    label: 'Upload Video',
    icon: 'pi pi-upload',
    command: () => router.push('/videos/upload'),
  },
  {
    label: 'My Videos',
    icon: 'pi pi-user',
    command: () => router.push('/videos/my-videos'),
  },
  {
    separator: true,
  },
  {
    label: 'Trending',
    icon: 'pi pi-chart-line',
    command: () => router.push('/videos/trending'),
  },
])

const articlesMenuItems = ref([
  {
    label: 'Browse Articles',
    icon: 'pi pi-book',
    command: () => router.push('/articles'),
  },
  {
    label: 'Write Article',
    icon: 'pi pi-pencil',
    command: () => router.push('/articles/create'),
  },
  {
    label: 'My Articles',
    icon: 'pi pi-user',
    command: () => router.push('/articles/my-articles'),
  },
  {
    separator: true,
  },
  {
    label: 'Popular',
    icon: 'pi pi-star',
    command: () => router.push('/articles/popular'),
  },
])

const userMenuItems = ref([
  {
    label: 'Profile',
    icon: 'pi pi-user',
    command: () => router.push('/profile'),
  },
  {
    label: 'Settings',
    icon: 'pi pi-cog',
    command: () => router.push('/settings'),
  },
  {
    label: 'Subscription',
    icon: 'pi pi-credit-card',
    command: () => router.push('/subscription'),
  },
  {
    separator: true,
  },
  {
    label: 'Logout',
    icon: 'pi pi-sign-out',
    command: logout,
  },
])

const toggleVideosMenu = (event: Event) => {
  videosMenu.value.toggle(event)
}

const toggleArticlesMenu = (event: Event) => {
  articlesMenu.value.toggle(event)
}

const toggleUserMenu = (event: Event) => {
  userMenu.value.toggle(event)
}
</script>

<template>
  <nav
    class="bg-gradient-to-r from-white via-purple-50 to-white backdrop-blur-lg border-b border-purple-100 shadow-lg fixed w-full z-50"
  >
    <div class="max-w-7xl mx-auto px-6 py-4">
      <div class="flex items-center justify-between">
        <!-- Logo with enhanced styling -->
        <router-link
          to="/"
          class="group flex items-center space-x-2 text-transparent bg-gradient-to-r from-purple-600 via-pink-600 to-blue-600 bg-clip-text text-2xl font-bold tracking-wide hover:scale-105 transition-transform duration-200"
        >
          <div
            class="w-8 h-8 bg-gradient-to-br from-purple-500 to-pink-500 rounded-lg flex items-center justify-center group-hover:rotate-12 transition-transform duration-200"
          >
            <i class="pi pi-share-alt text-white text-sm"></i>
          </div>
          <span>ShareSphere</span>
        </router-link>

        <!-- Navigation Items -->
        <div class="flex items-center gap-8">
          <template v-if="auth.isLoggedIn">
            <!-- Content Menus for Logged In Users -->
            <div class="flex items-center gap-6">
              <!-- Videos Menu -->
              <div class="relative">
                <Button
                  @click="toggleVideosMenu"
                  class="!bg-transparent !border-0 !text-gray-700 hover:!text-purple-600 hover:!bg-purple-50 !font-medium !transition-all !duration-200 !rounded-lg !px-4 !py-2"
                  aria-haspopup="true"
                  aria-controls="videos_menu"
                >
                  <i class="pi pi-video mr-2"></i>
                  Videos
                  <i class="pi pi-chevron-down ml-2 text-xs"></i>
                </Button>
                <Menu
                  ref="videosMenu"
                  id="videos_menu"
                  :model="videosMenuItems"
                  :popup="true"
                  class="!mt-2 !shadow-xl !border-0 !rounded-xl !overflow-hidden"
                />
              </div>

              <!-- Articles Menu -->
              <div class="relative">
                <Button
                  @click="toggleArticlesMenu"
                  class="!bg-transparent !border-0 !text-gray-700 hover:!text-purple-600 hover:!bg-purple-50 !font-medium !transition-all !duration-200 !rounded-lg !px-4 !py-2"
                  aria-haspopup="true"
                  aria-controls="articles_menu"
                >
                  <i class="pi pi-book mr-2"></i>
                  Articles
                  <i class="pi pi-chevron-down ml-2 text-xs"></i>
                </Button>
                <Menu
                  ref="articlesMenu"
                  id="articles_menu"
                  :model="articlesMenuItems"
                  :popup="true"
                  class="!mt-2 !shadow-xl !border-0 !rounded-xl !overflow-hidden"
                />
              </div>
            </div>

            <!-- User Section -->
            <div class="flex items-center gap-4 pl-6 border-l border-purple-200">
              <!-- Tier Badge -->
              <div class="hidden md:flex items-center">
                <div
                  :class="[
                    'px-3 py-1.5 rounded-full text-xs font-semibold flex items-center gap-1.5 shadow-sm hover:shadow-md transition-all duration-200 cursor-pointer',
                    tierConfig.class,
                  ]"
                  @click="router.push('/subscription')"
                  title="Click to manage subscription"
                >
                  <i :class="tierConfig.icon" class="text-xs"></i>
                  <span>{{ tierConfig.label }}</span>
                  <i class="pi pi-external-link text-xs opacity-70"></i>
                </div>
              </div>

              <!-- Welcome Message with Animation -->
              <div
                class="hidden md:flex items-center gap-2 bg-gradient-to-r from-purple-100 to-pink-100 px-4 py-2 rounded-full"
              >
                <div class="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                <span class="!text-gray-700 text-sm font-medium">
                  Hi, <span class="text-purple-600 font-semibold">{{ auth.user?.username }}</span>
                </span>
              </div>

              <!-- User Avatar with Menu -->
              <div class="relative">
                <Button
                  @click="toggleUserMenu"
                  class="!bg-transparent !border-0 !p-0 hover:!scale-110 !transition-transform !duration-200"
                  aria-haspopup="true"
                  aria-controls="user_menu"
                >
                  <div class="relative">
                    <Avatar
                      :image="auth.user?.avatar ?? undefined"
                      shape="circle"
                      size="normal"
                      class="!w-10 !h-10 border-2 border-purple-200 shadow-md hover:shadow-lg transition-shadow duration-200"
                      v-if="auth.user?.avatar"
                    />
                    <Avatar
                      v-else
                      :label="auth.user?.username?.[0]?.toUpperCase() || 'U'"
                      shape="circle"
                      size="normal"
                      class="!w-10 !h-10 !bg-gradient-to-br !from-purple-500 !to-pink-500 !text-white border-2 border-purple-200 shadow-md hover:shadow-lg transition-shadow duration-200"
                    />
                    <!-- Tier indicator badge on avatar -->
                    <div
                      :class="[
                        'absolute -top-1 -right-1 w-4 h-4 rounded-full flex items-center justify-center text-white text-xs',
                        tierConfig.badgeClass,
                      ]"
                    >
                      <i :class="tierConfig.icon" class="text-xs"></i>
                    </div>
                  </div>
                </Button>
                <Menu
                  ref="userMenu"
                  id="user_menu"
                  :model="userMenuItems"
                  :popup="true"
                  class="!mt-2 !shadow-xl !border-0 !rounded-xl !overflow-hidden"
                />
              </div>
            </div>
          </template>

          <template v-else>
            <!-- Guest Navigation with Enhanced Styling -->
            <div class="flex items-center gap-6">
              <router-link
                to="/"
                class="relative !text-gray-700 hover:text-purple-600 font-medium transition-all duration-200 px-3 py-2 rounded-lg hover:bg-purple-50 group"
              >
                <i
                  class="pi pi-home mr-2 group-hover:scale-110 transition-transform duration-200"
                ></i>
                Home
                <span
                  class="absolute bottom-0 left-0 w-0 h-0.5 bg-gradient-to-r from-purple-600 to-pink-600 group-hover:w-full transition-all duration-300"
                ></span>
              </router-link>

              <router-link
                to="/register"
                class="relative !text-gray-700 hover:text-purple-600 font-medium transition-all duration-200 px-3 py-2 rounded-lg hover:bg-purple-50 group"
              >
                <i
                  class="pi pi-user-plus mr-2 group-hover:scale-110 transition-transform duration-200"
                ></i>
                Register
                <span
                  class="absolute bottom-0 left-0 w-0 h-0.5 bg-gradient-to-r from-purple-600 to-pink-600 group-hover:w-full transition-all duration-300"
                ></span>
              </router-link>

              <router-link
                to="/login"
                class="bg-gradient-to-r from-purple-600 to-pink-600 text-white px-6 py-2.5 rounded-lg font-medium hover:from-purple-700 hover:to-pink-700 transition-all duration-200 shadow-md hover:shadow-lg hover:scale-105 flex items-center gap-2"
              >
                <i class="pi pi-sign-in"></i>
                Login
              </router-link>
            </div>
          </template>
        </div>
      </div>
    </div>

    <!-- Mobile Menu Button (for future mobile implementation) -->
    <div class="md:hidden absolute right-4 top-4">
      <Button
        class="!bg-transparent !border-0 !text-gray-700 hover:!text-purple-600 !p-2"
        icon="pi pi-bars"
      />
    </div>
  </nav>
</template>

<style scoped>
/* Custom dropdown menu styling */
:deep(.p-menu) {
  background-color: rgba(255, 255, 255, 0.95) !important;
  backdrop-filter: blur(16px) !important;
}

:deep(.p-menu .p-menuitem-link) {
  @apply text-gray-700 hover:!text-purple-600 hover:!bg-purple-50 !transition-all !duration-200 !rounded-lg !mx-2 !my-1;
}

:deep(.p-menu .p-menuitem-icon) {
  @apply !text-purple-500;
}

:deep(.p-menu .p-separator) {
  @apply !border-purple-200 !mx-4;
}

/* Enhanced animations */
@keyframes slideIn {
  from {
    opacity: 0;
    transform: translateY(-10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

:deep(.p-menu) {
  animation: slideIn 0.2s ease-out;
}

/* Tier badge hover effects */
.tier-badge:hover {
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
}
</style>
