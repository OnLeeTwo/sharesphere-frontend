<script setup lang="ts">
import { RouterLink, useRouter } from 'vue-router'
import Card from 'primevue/card'
import Button from 'primevue/button'

const router = useRouter()
</script>

<template>
  <div
    class="min-h-screen bg-gradient-to-br from-blue-600 via-purple-600 to-pink-600 py-16 px-4 flex items-center justify-center"
  >
    <div class="max-w-4xl w-full">
      <div class="text-center text-white mb-10">
        <h1 class="text-4xl font-bold mb-2">Welcome to ShareSphere</h1>
        <p class="text-lg text-white/90">
          Discover and share engaging articles and videos from creators around the world.
        </p>
      </div>

      <!-- Feature Cards -->
      <div class="grid md:grid-cols-3 gap-6">
        <Card class="text-center shadow-xl">
          <template #title>Free Plan</template>
          <template #content>
            <p>Enjoy access to free content with basic community features.</p>
            <Button @click="router.push('/register')" label="Get Started" class="mt-4 w-full" />
          </template>
        </Card>
        <Card class="text-center shadow-xl border-blue-400 border-2">
          <template #title>Basic Plan</template>
          <template #content>
            <p>Unlock extra features and support creators directly.</p>
            <Button @click="router.push('/upgrade')" label="Upgrade" class="mt-4 w-full" />
          </template>
        </Card>
        <Card class="text-center shadow-xl border-purple-400 border-2">
          <template #title>Premium Plan</template>
          <template #content>
            <p>Get the full experience, early access, and exclusive content.</p>
            <Button @click="router.push('/upgrade')" label="Go Premium" class="mt-4 w-full" />
          </template>
        </Card>
      </div>

      <!-- Call to Action -->
      <div class="mt-12 text-center">
        <RouterLink to="/register">
          <Button
            label="Join Now"
            icon="pi pi-user-plus"
            class="p-button-lg p-button-rounded bg-purple-600 border-none hover:bg-purple-700 text-white"
          />
        </RouterLink>
      </div>
    </div>
  </div>
</template>
