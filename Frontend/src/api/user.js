import { apiClient, setAccessToken } from './client';

export const userApi = {
  updateProfile: async ({ username, profilePic }) => {
    const formData = new FormData();

    if (username) {
      formData.append('username', username);
    }

    if (profilePic) {
      formData.append('profilePic', profilePic);
    }

    return apiClient('/api/users/profile', {
      method: 'PATCH',
      body: formData,
    });
  },

  updatePassword: async (payload) => {
    const data = await apiClient('/api/users/password', {
      method: 'PATCH',
      body: payload,
    });

    setAccessToken(null);
    return data;
  },
};