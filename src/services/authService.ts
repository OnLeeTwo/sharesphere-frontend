import { AuthResponse, LoginPayload, OAuthPayload, RegisterPayload } from '@/utils/type'
import api from '@/utils/axios'

const API_BASE_URL =
  (import.meta.env.VITE_API_URL?.replace(/\/$/, '') ?? 'http://localhost:3000/api') + '/auth'

const register = async (payload: RegisterPayload): Promise<AuthResponse> => {
  const { data } = await api.post(`${API_BASE_URL}/register`, payload)
  return data
}

const login = async (payload: LoginPayload): Promise<AuthResponse> => {
  const { data } = await api.post(`${API_BASE_URL}/login`, payload)
  return data
}

const oauthLogin = async (payload: OAuthPayload): Promise<AuthResponse> => {
  const { data } = await api.post(`${API_BASE_URL}/oauth`, payload)
  return data
}

const profile = async (): Promise<OAuthPayload> => {
  const { data } = await api.get(`${API_BASE_URL}/profile`)
  return data.user
}

export const authService = {
  register,
  login,
  oauthLogin,
  profile,
}
