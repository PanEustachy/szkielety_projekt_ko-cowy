import { reactive } from 'vue';

const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';

const getToken = () => localStorage.getItem('blog_token');
const getUser = () => JSON.parse(localStorage.getItem('blog_user') || 'null');
const saveAuth = ({ token, user }) => {
  localStorage.setItem('blog_token', token);
  localStorage.setItem('blog_user', JSON.stringify(user));
};
const clearAuth = () => {
  localStorage.removeItem('blog_token');
  localStorage.removeItem('blog_user');
};

const authState = reactive({
  token: getToken(),
  user: getUser(),
});

const request = async (path, options = {}) => {
  const headers = { 'Content-Type': 'application/json', ...(options.headers || {}) };
  const token = getToken();
  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  const response = await fetch(`${BASE_URL}${path}`, { ...options, headers });
  const data = await response.json().catch(() => null);
  if (!response.ok) {
    throw data || { message: 'Błąd sieciowy' };
  }
  return data;
};

export const auth = {
  get user() {
    return authState.user;
  },
  isAuthenticated: () => Boolean(authState.token),
  logout: () => {
    clearAuth();
    authState.token = null;
    authState.user = null;
  },
  login: async (credentials) => {
    const response = await request('/auth/login', {
      method: 'POST',
      body: JSON.stringify(credentials),
    });
    saveAuth(response);
    authState.token = response.token;
    authState.user = response.user;
    return response;
  },
  register: async (payload) => {
    const response = await request('/auth/register', {
      method: 'POST',
      body: JSON.stringify(payload),
    });
    return response;
  },
};

export const articles = {
  list: () => request('/articles'),
  get: (id) => request(`/articles/${id}`),
  create: (payload) => request('/articles', { method: 'POST', body: JSON.stringify(payload) }),
  update: (id, payload) => request(`/articles/${id}`, { method: 'PUT', body: JSON.stringify(payload) }),
  remove: (id) => request(`/articles/${id}`, { method: 'DELETE' }),
  rate: (id, vote) => request(`/articles/${id}/rate`, { method: 'POST', body: JSON.stringify({ vote }) }),
};
