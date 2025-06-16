import './assets/main.css'

import { createApp } from 'vue'
import { createPinia } from 'pinia'

import App from './App.vue'
import router from './router'
import PrimeVue from 'primevue/config'
import Lara from '@primeuix/themes/lara'
import ToastService from 'primevue/toastservice'
import piniaPluginPersistedstate from 'pinia-plugin-persistedstate'

import 'primeicons/primeicons.css'

const pinia = createPinia()
pinia.use(piniaPluginPersistedstate)

const app = createApp(App)

app.use(router)
app.use(PrimeVue, {
  theme: {
    preset: Lara,
    options: {
      prefix: 'p',
      darkModeSelector: 'none',
    },
  },
})
app.use(ToastService)
app.use(pinia)

app.mount('#app')
