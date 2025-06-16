import axios from 'axios'
import { useAuthStore } from '@/store/authStore'

// Create an Axios instance
const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL ?? 'http://localhost:3000/api',
})

// Add a request interceptor to attach the token
api.interceptors.request.use((config) => {
  const auth = useAuthStore()

  if (auth.token) {
    config.headers.Authorization = `Bearer ${auth.token}`
  }

  return config
})

export default api
