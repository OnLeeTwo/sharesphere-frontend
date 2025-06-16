<script setup lang="ts">
import Button from 'primevue/button'
import { useRouter } from 'vue-router'

const router = useRouter()
const goHome = () => {
  router.push('/')
}
</script>

<template>
  <div
    class="flex items-center justify-center min-h-screen bg-gradient-to-br from-purple-600 via-blue-600 to-indigo-700 text-white px-4"
  >
    <div class="text-center">
      <h1 class="text-6xl font-bold mb-4">404</h1>
      <p class="text-xl mb-6">Oops! The page you’re looking for doesn’t exist.</p>
      <Button
        label="Go Home"
        class="bg-white text-purple-700 font-bold px-4 py-2 rounded"
        @click="goHome"
      />
    </div>
  </div>
</template>
