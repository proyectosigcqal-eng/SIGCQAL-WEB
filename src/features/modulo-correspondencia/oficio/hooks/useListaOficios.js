import { useState, useEffect } from 'react';
import { listarAcusesPorArea, listarTodos } from '../../acuseoficio/services/acuseoficioService';
import { useAreaUsuario, TODAS_LAS_AREAS } from '@/shared/hooks/useAreaUsuario';

export const useListaOficios = () => {
  const [oficios, setOficios] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // TODO: Obtener el área del usuario logueado
  const idArea = useAreaUsuario();

  const cargarOficios = async (idArea) => {
    if (!idArea) return;
    setLoading(true);
    setError(null);
    try {
       const data = idArea === TODAS_LAS_AREAS
                          ? await listarTodos()
                          : await listarPorArea(idArea);
      setOficios(data);
    } catch (err) {
      setError(err.message);
      console.error("Error al cargar oficios:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    cargarOficios(idArea);
  }, [idArea]);

  const recargar = () => {
    cargarOficios(idArea);
  };

  return {
    oficios,
    loading,
    error,
    recargar,
    areaForzada: idArea
  };
};
