// src/stores/authStore.ts
import { defineStore } from 'pinia'
import { jwtDecode } from 'jwt-decode'
import { AuthUser, JwtPayload } from '@/utils/type'
import { authService } from '@/services/authService'

export const useAuthStore = defineStore('auth', {
  state: () => ({
    token: '' as string,
    user: null as AuthUser | null,
  }),

  getters: {
    isLoggedIn: (state) => !!state.user,
    userTier: (state) => state.user?.tier ?? 'free',
  },

  actions: {
    // For both OAuth and manual login with only token
    setToken(token: string) {
      this.token = token
      try {
        const decoded = jwtDecode<JwtPayload>(token)
        this.user = decoded
      } catch (err) {
        console.error('Invalid JWT', err)
        this.user = null
        this.token = ''
      }
    },

    // ✅ For manual login response: { token, user }
    setLoginResponse({ token, user }: { token: string; user: JwtPayload }) {
      this.token = token
      this.user = user
    },

    logout() {
      this.token = ''
      this.user = null
    },

    async fetchUserProfile() {
      try {
        const userData = await authService.profile()
        this.user = userData
      } catch (err) {
        console.error('Failed to fetch user profile:', err)
      }
    },
  },

  persist: true,
})
