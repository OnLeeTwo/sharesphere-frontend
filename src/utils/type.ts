export type LoginFormValues = {
  email: string
  password: string
  remember?: boolean
}

export type Tier = 'free' | 'basic' | 'premium'

export interface RegisterPayload {
  username: string
  email: string
  password: string
  tier?: string
}

export interface LoginPayload {
  email: string
  password: string
}

export interface OAuthPayload {
  email: string
  username: string
  avatar: string
  provider: string | null
  providerId: string
  tier: string
}

export interface AuthResponse {
  token: string
  user: {
    id: number
    email: string
    tier: string
  }
}

export interface JwtPayload {
  id: number
  email: string
  tier: string
  username?: string
  provider?: string
  iat?: number
  exp?: number
}

export interface AuthUser {
  id?: number
  email: string
  username?: string
  avatar?: string
  tier: string
  provider?: string | null
  providerId?: string
  iat?: number
  exp?: number
}

export interface Video {
  id: number
  title: string
  description?: string
  video_url: string
  thumbnail_url?: string
  access_tier: Tier
  author_id?: number
  created_at?: string
  updated_at?: string
  author?: Author
  views?: number
  duration?: string
}

export interface ApiVideoResponse {
  videos: Video[]
  total: number
  page: number
  per_page: number
  total_pages: number
}

// Define Article type based on your existing Video type structure
interface Author {
  id: number
  username: string
  avatar: string
}

export interface Article {
  id: number
  title: string
  description: string
  content: string
  content_preview: string
  cover_image_url: string
  access_tier: Tier
  author_id: number
  created_at: string
  author: Author
  views: number
  read_time: string
  category: string
}

export interface ApiArticleResponse {
  articles: Article[]
  total: number
  page: number
  per_page: number
  total_pages: number
}

export type ArticleQueryParams = {
  page?: number
  per_page?: number
  search?: string
  sort_by?: string
  sort_order?: string
  access_tier?: string
  category?: string
}

export type VideoQueryParams = {
  page?: number
  per_page?: number
  search?: string
  sort_by?: string
  sort_order?: string
  access_tier?: string
  category?: string
}
