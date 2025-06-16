import type { ApiArticleResponse, Article } from '@/utils/type'
import api from '@/utils/axios'
import { ArticleQueryParams } from '@/utils/type'

const API_BASE_URL = import.meta.env.VITE_API_URL ?? 'http://localhost:3000/api/articles'

const fetchArticles = async (params: ArticleQueryParams): Promise<ApiArticleResponse> => {
  const { data } = await api.get<ApiArticleResponse>(API_BASE_URL, { params })
  return data
}

const fetchArticleById = async (id: string): Promise<Article> => {
  const { data } = await api.get<Article>(`${API_BASE_URL}/${id}`)
  return data
}

export const articleService = {
  fetchArticles,
  fetchArticleById,
}
