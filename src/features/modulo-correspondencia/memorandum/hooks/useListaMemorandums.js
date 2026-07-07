import { useState, useEffect } from 'react';
import { listarPorArea, listarTodos } from '../services/memorandumService';
import { useAreaUsuario, TODAS_LAS_AREAS } from '@/shared/hooks/useAreaUsuario';
 
export const useListaMemorandums = () => {
  const [memorandums, setMemorandums] = useState([]);
  const [loading, setLoading]         = useState(false);
  const [error, setError]             = useState(null);
 
  const idArea = useAreaUsuario();
 
  const cargarMemorandums = async () => {
    if (!idArea) return;
    if (idArea === null) return; // sin usuario logueado
 
    setLoading(true);
    setError(null);
    try {
      // Admin sin área → cargar todos
      const data = idArea === TODAS_LAS_AREAS
        ? await listarTodos({ page: 0, size: 10000 })
        : await listarPorArea(idArea, { page: 0, size: 10000 });
      setMemorandums(data);
    } catch (err) {
      setError(err.message);
      console.error('Error al cargar memorandums:', err);
    } finally {
      setLoading(false);
    }
  };
 
  useEffect(() => {
    cargarMemorandums();
  }, [idArea]);
 
  return { memorandums, loading, error, recargar: cargarMemorandums, areaForzada: idArea };
};