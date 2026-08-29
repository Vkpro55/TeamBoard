import { apiClient } from './client'

export const taskApi = {
  list: ({ page = 1, limit = 5, search, status, priority, sortBy } = {}) => {
    const params = new URLSearchParams({ page, limit })
    if (search) params.set('search', search)
    if (status) params.set('status', status)
    if (priority) params.set('priority', priority)
    if (sortBy) params.set('sortBy', sortBy)
    return apiClient(`/api/tasks?${params.toString()}`)
  },
  create: (projectId, payload) => apiClient(`/api/projects/${projectId}/tasks`, {
    method: 'POST',
    body: payload,
  }),
  update: (projectId, taskId, payload) => apiClient(`/api/projects/${projectId}/tasks/${taskId}`, {
    method: 'PUT',
    body: payload,
  }),
  delete: (projectId, taskId) => apiClient(`/api/projects/${projectId}/tasks/${taskId}`, {
    method: 'DELETE',
  }),
  complete: (projectId, taskId) => apiClient(`/api/projects/${projectId}/tasks/${taskId}/complete`, {
    method: 'PATCH',
  }),
}