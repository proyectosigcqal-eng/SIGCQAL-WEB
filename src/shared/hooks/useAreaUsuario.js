// src/shared/hooks/useAreaUsuario.js

// Valor especial que indica "mostrar todo" (para admins sin área asignada)
export const TODAS_LAS_AREAS = 'ALL';

/**
 * Devuelve el idArea del usuario logueado.
 * Si el usuario es admin sin área asignada, devuelve TODAS_LAS_AREAS ('ALL').
 * Si no hay usuario, devuelve null.
 */
export const useAreaUsuario = () => {
  const rawUser =
    localStorage.getItem('user') ||
    localStorage.getItem('usuario') ||
    localStorage.getItem('currentUser');

  if (!rawUser) return null;

  try {
    const user = JSON.parse(rawUser);

    const idArea =
      user?.idArea ??
      user?.area?.id ??
      user?.area ??
      user?.id_area ??
      null;

    // Si tiene área asignada, usarla normalmente
    if (idArea !== null && idArea !== undefined) return idArea;

    // Sin área → verificar si es admin para mostrar todo
    const esAdmin =
      user?.rol === 'Administrador' ||
      user?.role === 'Administrador' ||
      user?.rol === 'ADMIN' ||
      user?.role === 'ADMIN' ||
      user?.esAdmin === true ||
      user?.isAdmin === true ||
      user?.roles?.includes('ADMIN') ||
      user?.roles?.includes('Administrador');

    return esAdmin ? TODAS_LAS_AREAS : null;
  } catch {
    return null;
  }
};