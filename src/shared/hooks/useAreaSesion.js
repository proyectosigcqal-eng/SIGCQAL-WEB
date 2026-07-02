import { useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useAuth } from '@/shared/context/AuthContext';
import { useCatalogos } from '@/shared/hooks/useCatalogos';
import {
  findUsuarioEnCatalogo,
  resolveAreaId,
  resolveAreaIdFromSession,
  resolveNombreArea,
} from '@/shared/utils/sessionUtils';

/**
 * Resuelve el id_area activo: query param (?idArea=) → sesión → catálogo de usuarios.
 */
export const useAreaSesion = () => {
  const { session } = useAuth();
  const { areas, usuarios, cargandoCatalogos } = useCatalogos();
  const [searchParams] = useSearchParams();

  const idAreaParam = searchParams.get('idArea') ?? searchParams.get('id_area');
  const idAreaOverride = idAreaParam ? Number(idAreaParam) : null;

  const usuarioCatalogo = useMemo(
    () => findUsuarioEnCatalogo(usuarios, session),
    [usuarios, session]
  );

  const idArea = useMemo(
    () => resolveAreaId(session, usuarios, idAreaOverride),
    [session, usuarios, idAreaOverride]
  );

  const nombreArea = useMemo(
    () => resolveNombreArea(idArea, areas, usuarioCatalogo),
    [idArea, areas, usuarioCatalogo]
  );

  const tieneAreaEnSesion = !!resolveAreaIdFromSession(session);
  const listo =
    !cargandoCatalogos ||
    tieneAreaEnSesion ||
    (Number.isFinite(idAreaOverride) && idAreaOverride > 0);

  const error =
    listo && !idArea
      ? 'No se encontró el área del usuario en sesión. Verifica tu perfil o usa ?idArea= en la URL.'
      : null;

  return { idArea, nombreArea, listo, error, usuarioCatalogo };
};
