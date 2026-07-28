// src/shared/utils/sessionUtils.js

const SESSION_KEY = 'sigcqal_session';

const getSesionRaw = () => {
  try {
    const raw = sessionStorage.getItem(SESSION_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch { return null; }
};

// Lee el id del usuario — prueba las variaciones más comunes del DTO de login.
// Si tu backend devuelve otro campo, agrégalo aquí.
export const getIdUsuarioActual = () => {
  const s = getSesionRaw();
  return s?.idUsuario ?? s?.id ?? s?.usuarioId ?? s?.id_usuario ?? null;
};

// Lee el nombre/username para mostrarlo en oficios y formularios.
export const getNombreUsuarioActual = () => {
  const s = getSesionRaw();
  return s?.username ?? s?.nombre ?? s?.nombreUsuario ?? s?.nombre_usuario ?? null;
};

// Agregar al final del archivo:
export const getRolActual = () => {
  const s = getSesionRaw();
  // Prueba las variaciones más comunes — ajusta si tu backend guarda otro campo
  return s?.rol ?? s?.role ?? s?.nombreRol ?? s?.rolNombre ?? s?.authorities?.[0] ?? null;
};

export const esAsesor = () => {
  const rol = getRolActual();
  if (!rol) return false;
  const r = String(rol).toLowerCase();
  return r.includes('asesor');
};