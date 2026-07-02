import { useState, useEffect, useCallback } from 'react';
import { useAreaSesion } from '@/shared/hooks/useAreaSesion';
import { listarPorArea } from '../services/oficioService';

export const useListaOficios = () => {
  const { idArea, nombreArea, listo, error: areaError } = useAreaSesion();
  const [oficios, setOficios] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const cargarOficios = useCallback(async (areaId) => {
    if (!areaId) return;
    setLoading(true);
    setError(null);
    try {
      const data = await listarPorArea(areaId, { page: 0, size: 10000 });
      setOficios(data);
    } catch (err) {
      setError(err.message);
      console.error('Error al cargar oficios:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (!listo) return;
    if (!idArea) {
      setError(areaError);
      return;
    }
    cargarOficios(idArea);
  }, [idArea, listo, areaError, cargarOficios]);

  const recargar = () => {
    if (idArea) cargarOficios(idArea);
  };

  return {
    oficios,
    loading: loading || !listo,
    error,
    recargar,
    idArea,
    nombreArea,
  };
};
