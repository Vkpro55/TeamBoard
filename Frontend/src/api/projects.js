import { apiClient } from './client'

export const projectApi = {
  list: () => apiClient('/api/projects'),
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
  archive: (projectId) =>
    apiClient(`/api/projects/${projectId}/archive`, {
      method: 'PATCH',
    }),
}