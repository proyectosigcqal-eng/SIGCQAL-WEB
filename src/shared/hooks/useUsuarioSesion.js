import { useMemo } from 'react';
import { useAuth } from '@/shared/context/AuthContext';
import { useCatalogos } from '@/shared/hooks/useCatalogos';
import { findUsuarioEnCatalogo, resolveUserId } from '@/shared/utils/sessionUtils';

/**
 * Resuelve el id_usuario activo: sesión → catálogo de usuarios.
 */
export const useUsuarioSesion = () => {
  const { session } = useAuth();
  const { usuarios, cargandoCatalogos } = useCatalogos();

  const usuarioCatalogo = useMemo(
    () => findUsuarioEnCatalogo(usuarios, session),
    [usuarios, session]
  );

  const idUsuario = useMemo(() => {
    const fromSession = resolveUserId(session);
    if (fromSession) return fromSession;

    const fromCatalog = usuarioCatalogo?.id ?? usuarioCatalogo?.idUsuario ?? null;
    if (fromCatalog == null || fromCatalog === '') return null;

    const n = Number(fromCatalog);
    return Number.isFinite(n) ? n : null;
  }, [session, usuarioCatalogo]);

  const usuarioLogin =
    session?.usuarioLogin ??
    usuarioCatalogo?.usuarioLogin ??
    usuarioCatalogo?.username ??
    null;

  const nombreUsuario =
    usuarioCatalogo?.nombreUsuario ??
    usuarioCatalogo?.nombre ??
    usuarioLogin;

  const nombreArea = usuarioCatalogo?.nombreArea ?? null;
  const idArea = usuarioCatalogo?.idArea ?? usuarioCatalogo?.id_area ?? null;

  const listo = !cargandoCatalogos || !!resolveUserId(session);

  const error =
    listo && !idUsuario
      ? 'No se encontró el usuario en sesión. Por favor inicia sesión nuevamente.'
      : null;

  return {
    idUsuario,
    usuarioLogin,
    nombreUsuario,
    nombreArea,
    idArea,
    usuarioCatalogo,
    listo,
    error,
  };
};
