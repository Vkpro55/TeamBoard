import { apiClient } from './client'

export const dashboardApi = {
  get: () => apiClient('/api/dashboard'),
}
