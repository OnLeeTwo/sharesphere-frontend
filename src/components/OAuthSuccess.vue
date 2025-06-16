<script setup lang="ts">
import { useRoute, useRouter } from 'vue-router'
import { useAuthStore } from '@/store/authStore'

const route = useRoute()
const router = useRouter()
const auth = useAuthStore()

const token = route.query.token as string | undefined

if (token) {
  auth.setToken(token)
  router.replace('/dashboard')
} else {
  console.error('Missing token in query')
  router.replace('/login')
}
</script>

<template>
  <div class="p-6 text-center">
    <p class="text-lg">Logging you in...</p>
  </div>
</template>
