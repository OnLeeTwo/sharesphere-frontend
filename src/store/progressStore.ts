import { defineStore } from 'pinia'

export const useProgressStore = defineStore('progress', {
  state: () => ({
    // { [articleId: string]: scrollY: number }
    articleProgress: {} as Record<string, number>,
  }),

  getters: {
    getProgress: (state) => (articleId: string) => state.articleProgress[articleId] ?? 0,
  },

  actions: {
    saveProgress(articleId: string, scrollY: number) {
      this.articleProgress[articleId] = scrollY
    },
    clearProgress(articleId: string) {
      delete this.articleProgress[articleId]
    },
  },

  persist: true,
})
