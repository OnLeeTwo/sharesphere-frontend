import type { ApiVideoResponse, Video, VideoQueryParams } from '@/utils/type'
import api from '@/utils/axios'

const API_BASE_URL =
  (import.meta.env.VITE_API_URL?.replace(/\/$/, '') ?? 'http://localhost:3000/api') + '/videos'

const fetchVideos = async (params: VideoQueryParams): Promise<ApiVideoResponse> => {
  const { data } = await api.get<ApiVideoResponse>(API_BASE_URL, { params })
  return data
}

const fetchVideoById = async (id: string): Promise<Video> => {
  const { data } = await api.get<Video>(`${API_BASE_URL}/${id}`)
  return data
}

export const videoService = {
  fetchVideos,
  fetchVideoById,
}
