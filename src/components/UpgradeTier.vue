<script setup lang="ts">
import { computed } from 'vue'
import { useAuthStore } from '@/store/authStore'

import Card from 'primevue/card'
import Button from 'primevue/button'

const auth = useAuthStore()

const userTier = auth.userTier

const tiers = [
  {
    name: 'Free',
    value: 'free',
    price: '$0',
    features: ['Access to public articles and videos', 'Explore free content', 'Community support'],
  },
  {
    name: 'Basic',
    value: 'basic',
    price: '$9.99/mo',
    features: ['Everything in Free', 'Access to Basic content', 'Email support'],
  },
  {
    name: 'Premium',
    value: 'premium',
    price: '$19.99/mo',
    features: [
      'Everything in Basic',
      'Access to ALL content',
      'Priority support',
      'Monthly Webinars',
    ],
  },
]

const isCurrentTier = (tierValue: string) => tierValue === userTier

const isPremium = computed(() => userTier === 'premium')
</script>

<template>
  <div class="p-6">
    <!-- Premium Special Layout -->
    <div v-if="isPremium" class="text-center space-y-6">
      <h1 class="text-4xl font-extrabold text-purple-700">You're a Premium Member 🎉</h1>
      <p class="text-gray-700 text-lg">
        Thank you for supporting us! As a premium user, you have full access to all content and
        exclusive perks.
      </p>

      <div class="max-w-3xl mx-auto">
        <Card class="shadow-xl border-purple-500 ring-2 ring-purple-500 rounded-xl">
          <template #title>
            <div class="text-2xl font-bold text-purple-800">Premium Benefits</div>
          </template>
          <template #content>
            <ul class="text-left text-gray-700 space-y-3 text-sm">
              <li><i class="pi pi-check text-green-500"></i> Access to all videos and articles</li>
              <li><i class="pi pi-check text-green-500"></i> Priority technical support</li>
              <li><i class="pi pi-check text-green-500"></i> Monthly live webinars</li>
              <li><i class="pi pi-check text-green-500"></i> Early access to new content</li>
            </ul>
          </template>
        </Card>
      </div>
    </div>

    <!-- Regular Upgrade Layout -->
    <div v-else>
      <div class="text-center mb-10">
        <h1 class="text-3xl font-bold text-purple-700">Upgrade Your Experience</h1>
        <p class="text-gray-600">Choose the best plan that fits your learning journey</p>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card
          v-for="tier in tiers"
          :key="tier.name"
          class="relative shadow-lg rounded-xl border"
          :class="{
            'border-purple-500 ring-2 ring-purple-500': isCurrentTier(tier.value),
            'bg-gray-50': isCurrentTier(tier.value),
          }"
        >
          <template #title>
            <div class="text-xl font-semibold text-gray-800 text-center">{{ tier.name }}</div>
          </template>

          <template #content>
            <div class="text-center mb-4 text-2xl font-bold text-purple-700">{{ tier.price }}</div>
            <ul class="mb-4 space-y-2 text-sm text-gray-600">
              <li v-for="feature in tier.features" :key="feature" class="flex items-center gap-2">
                <i class="pi pi-check-circle text-green-500"></i> {{ feature }}
              </li>
            </ul>
            <Button
              :label="isCurrentTier(tier.value) ? 'Current Plan' : 'Upgrade Now'"
              :disabled="isCurrentTier(tier.value)"
              class="w-full"
              severity="primary"
            />
          </template>

          <div
            v-if="isCurrentTier(tier.value)"
            class="absolute top-2 right-2 bg-purple-500 text-white text-xs px-2 py-1 rounded-full"
          >
            Your Plan
          </div>
        </Card>
      </div>
    </div>
  </div>
</template>
