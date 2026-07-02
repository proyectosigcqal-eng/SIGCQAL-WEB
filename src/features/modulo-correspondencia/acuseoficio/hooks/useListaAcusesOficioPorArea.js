import { useState, useEffect, useCallback } from 'react';
import { useAreaSesion } from '@/shared/hooks/useAreaSesion';
import { listarAcusesPorArea } from '../services/acuseoficioService';

export const useListaAcusesOficioPorArea = () => {
  const { idArea, nombreArea, listo, error: areaError } = useAreaSesion();
  const [acuses, setAcuses] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const cargarAcuses = useCallback(async (areaId) => {
    if (!areaId) return;
    setLoading(true);
    setError(null);
    try {
      const data = await listarAcusesPorArea(areaId);
      setAcuses(data);
    } catch (err) {
      setError(err.message);
      console.error('Error al cargar acuses de oficio por área:', err);
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
    cargarAcuses(idArea);
  }, [idArea, listo, areaError, cargarAcuses]);

  const recargar = () => {
    if (idArea) cargarAcuses(idArea);
  };

  return {
    acuses,
    loading: loading || !listo,
    error,
    recargar,
    idArea,
    nombreArea,
  };
};
