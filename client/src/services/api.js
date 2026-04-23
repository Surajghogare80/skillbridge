import axios from 'axios';
import { API_BASE_URL } from '../utils/constants';

const isDev = import.meta.env.DEV;

// ─── Axios Instance ────────────────────────────────────────────
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: { 'Content-Type': 'application/json' },
  timeout: 10000, // 10s timeout — avoids infinite hang when server is down
});

// ─── Request Interceptor: Attach JWT token ─────────────────────
api.interceptors.request.use( 
  (config) => {
    const token = localStorage.getItem('skillbridge_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    // Log in dev
    if (isDev) {
      console.log(`[API] ➜ ${config.method?.toUpperCase()} ${config.baseURL}${config.url}`, config.data || '');
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// ─── Response Interceptor: Global error handling ───────────────
api.interceptors.response.use(
  (response) => {
    if (isDev) {
      console.log(`[API] ✓ ${response.status} ${response.config.url}`, response.data);
    }
    return response;
  },
  (error) => {
    if (isDev) {
      console.error(
        `[API] ✗ ${error.response?.status || 'NETWORK'} ${error.config?.url}`,
        error.response?.data || error.message
      );
    }

    // No response = server is down or CORS issue
    if (!error.response) {
      error.userMessage = 'Cannot connect to server. Please make sure the backend is running.';
      return Promise.reject(error);
    }

    // 401 = invalid/expired token → force logout
    if (error.response.status === 401) {
      localStorage.removeItem('skillbridge_token');
      localStorage.removeItem('skillbridge_user');
      if (window.location.pathname !== '/login') {
        window.location.href = '/login';
      }
    }

    // Attach a clean message for components to use
    error.userMessage = error.response?.data?.message || 'Something went wrong. Please try again.';
    return Promise.reject(error);
  }
);

export default api;
