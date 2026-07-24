import { apiClient } from './client'

export const taskApi = {
  list: ({ page = 1, limit = 5 } = {}) => apiClient(`/api/tasks?page=${page}&limit=${limit}`),
}