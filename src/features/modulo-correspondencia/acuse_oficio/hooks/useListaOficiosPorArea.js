import { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import { useAreaSesion } from '@/shared/hooks/useAreaSesion';
import API_BASE_URL from '@/shared/config/api';

export const useListaOficiosPorArea = () => {
  const { idArea, nombreArea, listo, error: areaError } = useAreaSesion();
  const [oficios, setOficios] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const cargarOficios = useCallback(async (areaId) => {
    if (!areaId) return;
    setLoading(true);
    setError(null);
    try {
      const res = await axios.get(`${API_BASE_URL}/acuse-oficio/area/${areaId}`);
      setOficios(res.data);
    } catch (err) {
      setError(err.message);
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
