// src/shared/utils/fetchInterceptor.js

const TOKEN_KEY = 'sigcqal_token';

export const initFetchInterceptor = () => {
  const originalFetch = window.fetch;

  window.fetch = async (url, options = {}) => {
    const token = sessionStorage.getItem(TOKEN_KEY);

    // Solo inyecta el header si la URL apunta a tu propio backend
    const esApiPropia = typeof url === 'string' && (
      url.includes('localhost:8081') ||
      url.includes('SIGCQAL')
    );

    if (token && esApiPropia) {
      options = {
        ...options,
        headers: {
          ...options.headers,
          Authorization: `Bearer ${token}`,
        },
      };
    }

    const response = await originalFetch(url, options);

    // Si el token expiró → limpiar y redirigir al login
    if (response.status === 401 && esApiPropia) {
      sessionStorage.clear();
      window.location.href = '/login';
    }

    return response;
  };
};