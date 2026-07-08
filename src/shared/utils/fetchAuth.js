// src/shared/utils/fetchAuth.js
import { API_BASE_URL } from '@/shared/config/api';

const TOKEN_KEY = 'sigcqal_token';

export const fetchAuth = async (path, options = {}) => {
  const token = sessionStorage.getItem(TOKEN_KEY);
  const headers = {
    'Content-Type': 'application/json',
    ...(options.headers ?? {}),
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };
  const res = await fetch(`${API_BASE_URL}${path}`, { ...options, headers });

  // Si el token expiró o la sesión fue invalidada → limpiar y redirigir al login
  if (res.status === 401) {
    sessionStorage.clear();
    window.location.href = '/login';
    throw new Error('Sesión expirada');
  }

  return res;
};