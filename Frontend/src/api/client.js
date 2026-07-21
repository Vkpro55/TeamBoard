const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

let accessToken = localStorage.getItem('accessToken');

export const setAccessToken = (token) => {
  accessToken = token;

  if (token) {
    localStorage.setItem('accessToken', token);
    return;
  }

  localStorage.removeItem('accessToken');
};

export const getAccessToken = () => accessToken;
/**
 * APICLIENT exactly like axios that only knows
   - how to send requests
   - how to attach headers
   - how to send JSON
   - how to parse JSON
   - how to throw errors
 */
export const apiClient = async (endpoint, options = {}) => {
  const { body, headers = {}, auth = true, ...rest } = options;

  const config = {
    method: 'GET',
    credentials: 'include',
    ...rest,
    headers: {
      ...(auth ? { Authorization: accessToken ? `Bearer ${accessToken}` : '' } : {}),
      ...headers,
    },
  };

  if (body !== undefined) {
    config.body = JSON.stringify(body);
  }

  if (body !== undefined && !headers['Content-Type']) {
    config.headers['Content-Type'] = 'application/json';
  }

  const response = await fetch(`${API_BASE_URL}${endpoint}`, config);
  const contentType = response.headers.get('content-type') || '';

  let data = null;
  if (contentType.includes('application/json')) {
    data = await response.json();
  } else if (response.status !== 204) {
    data = await response.text();
  }

  if (!response.ok) {
    throw new Error(data?.error || data?.message || 'Request failed');
  }

  return data;
};
