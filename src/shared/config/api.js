// Central API base URL. Uses Vite env var if provided, fallback to localhost.
export const API_BASE_URL = import.meta?.env?.VITE_API_BASE_URL || 'http://localhost:8081/SIGCQAL_Prod/api/v1';

export default API_BASE_URL;

// Optional helper: build endpoint path
export function endpoint(path) {
  if (!path) return API_BASE_URL;
  return `${API_BASE_URL}${path.startsWith('/') ? '' : '/'}${path}`;
}

// Host root without the trailing /api/v1 — useful for constructing file links
export const API_HOST = import.meta?.env?.VITE_API_HOST || 'http://localhost:8081/SIGCQAL_Prod';

export function endpointApi(path) {
  if (!path) return `${API_HOST}/api`;
  return `${API_HOST}/api${path.startsWith('/') ? '' : '/'}${path}`;
}

/**
 * Build an absolute URL to a file returned by the backend.
 * The backend typically returns paths like `/api/files/...` (already absolute to the app root).
 */
export function fileUrl(relativePath) {
  if (!relativePath) return null;
  return `${API_HOST}${relativePath.startsWith('/') ? '' : '/'}${relativePath}`;
}

// src/shared/config/api.js  — agrega esto al final del archivo actual

import axios from 'axios';

const TOKEN_KEY = 'sigcqal_token'; // misma clave que usa AuthContext

// ✅ Instancia configurada — úsala en todos los servicios en lugar de axios directo
const apiClient = axios.create({
  baseURL: API_BASE_URL,
});

// Interceptor de request: inyecta Bearer token en cada llamada
apiClient.interceptors.request.use((config) => {
  const token = sessionStorage.getItem(TOKEN_KEY);
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Interceptor de response: si expira el token, limpia y redirige
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      sessionStorage.clear();
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export { apiClient };
