import { useState, useEffect, useCallback } from 'react';
import { useAreaSesion } from '@/shared/hooks/useAreaSesion';
import { obtenerCorrespondenciaPendientePorArea } from '../services/correspondenciaService';

export const useCorrespondenciaPendientePorArea = () => {
  const { idArea, nombreArea, listo, error: areaError } = useAreaSesion();
  const [correspondencia, setCorrespondencia] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const cargarCorrespondencia = useCallback(async (areaId) => {
    if (!areaId) return;
    setLoading(true);
    setError(null);
    try {
      const data = await obtenerCorrespondenciaPendientePorArea(areaId);
      setCorrespondencia(data);
    } catch (err) {
      setError(err?.message || 'Error al obtener correspondencia pendiente por área');
      console.error('Error al cargar correspondencia pendiente por área:', err);
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
    cargarCorrespondencia(idArea);
  }, [idArea, listo, areaError, cargarCorrespondencia]);

  const recargar = () => {
    if (idArea) cargarCorrespondencia(idArea);
  };

  return {
    correspondencia,
    loading: loading || !listo,
    error,
    recargar,
    idArea,
    nombreArea,
  };
};
