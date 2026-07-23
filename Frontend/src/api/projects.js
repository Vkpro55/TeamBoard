import { apiClient } from './client'

export const projectApi = {
  list: () => apiClient('/api/projects'),
}