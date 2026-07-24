import { apiClient } from './client'

export const taskApi = {
  list: ({ page = 1, limit = 5 } = {}) => apiClient(`/api/tasks?page=${page}&limit=${limit}`),
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