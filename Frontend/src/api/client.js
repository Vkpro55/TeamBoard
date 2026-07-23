const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

const ACCESS_TOKEN_KEY = 'accessToken';

const getStoredAccessToken = () => localStorage.getItem(ACCESS_TOKEN_KEY) || sessionStorage.getItem(ACCESS_TOKEN_KEY);

let accessToken = getStoredAccessToken();

export const setAccessToken = (token, { rememberMe = false } = {}) => {
  accessToken = token;

  if (token) {
    const storage = rememberMe ? localStorage : sessionStorage;
    const otherStorage = rememberMe ? sessionStorage : localStorage;

    storage.setItem(ACCESS_TOKEN_KEY, token);
    otherStorage.removeItem(ACCESS_TOKEN_KEY);
    return;
  }

  localStorage.removeItem(ACCESS_TOKEN_KEY);
  sessionStorage.removeItem(ACCESS_TOKEN_KEY);
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
    config.body = body instanceof FormData ? body : JSON.stringify(body);
  }

  if (body !== undefined && !(body instanceof FormData) && !headers['Content-Type']) {
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
