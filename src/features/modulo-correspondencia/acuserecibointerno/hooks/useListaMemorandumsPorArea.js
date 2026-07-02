import { useState, useEffect, useCallback } from 'react';
import { useAreaSesion } from '@/shared/hooks/useAreaSesion';
import { listarPorArea } from '../services/acuserecibointernoService';

export const useListaMemorandumsPorArea = () => {
  const { idArea, nombreArea, listo, error: areaError } = useAreaSesion();
  const [memorandums, setMemorandums] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const cargarMemorandums = useCallback(async (areaId) => {
    if (!areaId) return;
    setLoading(true);
    setError(null);
    try {
      const data = await listarPorArea(areaId);
      setMemorandums(data);
    } catch (err) {
      setError(err.message);
      console.error('Error al cargar memorandums por área:', err);
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
    cargarMemorandums(idArea);
  }, [idArea, listo, areaError, cargarMemorandums]);

  const recargar = () => {
    if (idArea) cargarMemorandums(idArea);
  };

  return {
    memorandums,
    loading: loading || !listo,
    error,
    recargar,
    idArea,
    nombreArea,
  };
};
