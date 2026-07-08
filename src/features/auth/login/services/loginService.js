// src/features/auth/services/authService.js
import { API_BASE_URL } from '@/shared/config/api';

export const loginService = async ({ usuarioLogin, password }) => {
  const res = await fetch(`${API_BASE_URL}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ usuarioLogin, password }),
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.detail ?? `Error ${res.status}`);
  }
  return res.json(); // { token, refreshToken, roles, idUsuario, ... }
};