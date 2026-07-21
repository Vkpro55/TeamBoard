import { apiClient, setAccessToken } from './client';

export const authApi = {
  signup: async (payload) => {
    const data = await apiClient('/api/auth/signup', {
      method: 'POST',
      body: payload,
    });

    setAccessToken(data.accessToken);
    return data;
  },

  login: async (payload) => {
    const data = await apiClient('/api/auth/login', {
      method: 'POST',
      body: payload,
    });

    setAccessToken(data.accessToken);
    return data;
  },

  logout: async () => {
    await apiClient('/api/auth/logout', {
      method: 'POST',
    });

    setAccessToken(null);
  },

  refresh: async () => {
    const data = await apiClient('/api/auth/refresh', {
      method: 'GET',
    });

    setAccessToken(data.accessToken);
    return data;
  },

  me: async () => {
    return apiClient('/api/auth/me', {
      method: 'GET',
    });
  },
};
