import { apiClient, setAccessToken } from './client';

export const authApi = {
  signup: async (payload) => {
    return apiClient('/api/auth/signup', {
      method: 'POST',
      body: payload,
      auth: false,
    });
  },

  login: async (payload) => {
    const { rememberMe = false } = payload;
    const data = await apiClient('/api/auth/login', {
      method: 'POST',
      body: payload,
    });

    setAccessToken(data.accessToken, { rememberMe });
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

    setAccessToken(data.accessToken, { rememberMe: data.rememberMe });
    return data;
  },

  me: async () => {
    return apiClient('/api/auth/me', {
      method: 'GET',
    });
  },
};
