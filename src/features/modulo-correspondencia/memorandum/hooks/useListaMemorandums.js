import { useState, useEffect, useCallback } from 'react';
import { useAreaSesion } from '@/shared/hooks/useAreaSesion';
import { listarPorArea } from '../services/memorandumService';

export const useListaMemorandums = () => {
  const { idArea, nombreArea, listo, error: areaError } = useAreaSesion();
  const [memorandums, setMemorandums] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const cargarMemorandums = useCallback(async (areaId) => {
    if (!areaId) return;
    setLoading(true);
    setError(null);
    try {
      const data = await listarPorArea(areaId, { page: 0, size: 10000 });
      setMemorandums(data);
    } catch (err) {
      setError(err.message);
      console.error('Error al cargar memorandums:', err);
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
