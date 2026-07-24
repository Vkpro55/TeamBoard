import { apiClient } from './client'

export const projectApi = {
  list: ({ page = 1, limit = 5 } = {}) => apiClient(`/api/projects?page=${page}&limit=${limit}`),
  create: (payload) =>
    apiClient('/api/projects', {
      method: 'POST',
      body: payload,
    }),
  update: (projectId, payload) =>
    apiClient(`/api/projects/${projectId}`, {
      method: 'PUT',
      body: payload,
    }),
  delete: (projectId) =>
    apiClient(`/api/projects/${projectId}`, {
      method: 'DELETE',
    }),
  archive: (projectId) =>
    apiClient(`/api/projects/${projectId}/archive`, {
      method: 'PATCH',
    }),
}