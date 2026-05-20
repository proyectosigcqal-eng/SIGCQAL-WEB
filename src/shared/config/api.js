// Central API base URL. Uses Vite env var if provided, fallback to localhost.
export const API_BASE_URL = import.meta?.env?.VITE_API_BASE_URL || 'http://localhost:8081/SIGCQAL_dev/api/v1';

export default API_BASE_URL;

// Optional helper: build endpoint path
export function endpoint(path) {
  if (!path) return API_BASE_URL;
  return `${API_BASE_URL}${path.startsWith('/') ? '' : '/'}${path}`;
}

// Host root without the trailing /api/v1 — useful for constructing file links
export const API_HOST = import.meta?.env?.VITE_API_HOST || 'http://localhost:8081/SIGCQAL_dev';

/**
 * Build an absolute URL to a file returned by the backend.
 * The backend typically returns paths like `/api/files/...` (already absolute to the app root).
 */
export function fileUrl(relativePath) {
  if (!relativePath) return null;
  return `${API_HOST}${relativePath.startsWith('/') ? '' : '/'}${relativePath}`;
}
