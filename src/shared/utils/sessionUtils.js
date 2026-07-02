const SESSION_KEY = 'sigcqal_session';

export const getStoredSession = () => {
  try {
    const raw = sessionStorage.getItem(SESSION_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
};

export const resolveUserId = (session) => {
  if (!session) return null;
  const id = session.idUsuario ?? session.id ?? session.usuarioId ?? null;
  if (id == null || id === '') return null;
  const n = Number(id);
  return Number.isFinite(n) ? n : null;
};

export const resolveAreaIdFromSession = (session) => {
  if (!session) return null;
  const id = session.idArea ?? session.id_area ?? null;
  if (id == null || id === '') return null;
  const n = Number(id);
  return Number.isFinite(n) ? n : null;
};

export const findUsuarioEnCatalogo = (usuarios, session) => {
  if (!Array.isArray(usuarios) || !session) return null;
  const login = session.usuarioLogin;
  const userId = resolveUserId(session);

  if (login) {
    const byLogin = usuarios.find(
      (u) => u.usuarioLogin === login || u.username === login
    );
    if (byLogin) return byLogin;
  }

  if (userId != null) {
    return usuarios.find(
      (u) => Number(u.id ?? u.idUsuario) === Number(userId)
    ) ?? null;
  }

  return null;
};

export const resolveAreaId = (session, usuarios, idAreaOverride = null) => {
  if (idAreaOverride != null) {
    const n = Number(idAreaOverride);
    if (Number.isFinite(n) && n > 0) return n;
  }

  const fromSession = resolveAreaIdFromSession(session);
  if (fromSession) return fromSession;

  const usuario = findUsuarioEnCatalogo(usuarios, session);
  const fromCatalog = usuario?.idArea ?? usuario?.id_area ?? null;
  if (fromCatalog == null || fromCatalog === '') return null;

  const n = Number(fromCatalog);
  return Number.isFinite(n) ? n : null;
};

export const resolveNombreArea = (idArea, areas, usuarioCatalogo) => {
  if (!idArea) return null;

  const area = areas?.find(
    (a) => Number(a.id ?? a.idArea) === Number(idArea)
  );

  return (
    area?.nombreArea ??
    area?.nombre ??
    usuarioCatalogo?.nombreArea ??
    `Área ${idArea}`
  );
};

/** Normaliza la sesión tras login para exponer idUsuario e idArea de forma consistente. */
export const normalizeLoginSession = (data) => {
  if (!data || typeof data !== 'object') return data;

  const idUsuario = resolveUserId(data);
  const idArea = resolveAreaIdFromSession(data);

  return {
    ...data,
    ...(idUsuario != null
      ? { idUsuario, id: idUsuario, usuarioId: idUsuario }
      : {}),
    ...(idArea != null ? { idArea, id_area: idArea } : {}),
  };
};
