// src/shared/hooks/useAreaUsuario.js

export const TODAS_LAS_AREAS = 'ALL';

export const useAreaUsuario = () => {
  // ✅ CORRECCIÓN: AuthContext guarda en sessionStorage con clave 'sigcqal_session'
  // (no en localStorage con 'user'/'usuario'/'currentUser')
  const raw = sessionStorage.getItem('sigcqal_session');
  if (!raw) return null;

  try {
    const session = JSON.parse(raw);
    // session = { idUsuario, usuarioLogin, idArea, nombreArea, roles }
    // que es el AuthResponse sin token/refreshToken

    const idArea = session?.idArea ?? null;

    // Detectar Administrador
    const esAdmin = Array.isArray(session?.roles)
      ? session.roles.some(r => r.idRol === 1 || r.nombreRol === 'Administrador')
      : false;

    if (esAdmin) return TODAS_LAS_AREAS;
    if (idArea !== null && idArea !== undefined) return idArea;
    return null;

  } catch {
    return null;
  }
};