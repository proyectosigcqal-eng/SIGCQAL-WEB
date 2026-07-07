import { useState, useEffect } from 'react';
import { listarPorArea, listarTodos } from '../services/acuserecibointernoService';
import { useAreaUsuario, TODAS_LAS_AREAS } from '@/shared/hooks/useAreaUsuario';
 
export const useListaMemorandumsPorArea = () => {
  const [memorandums, setMemorandums] = useState([]);
  const [loading, setLoading]         = useState(false);
  const [error, setError]             = useState(null);
 
  const idArea = useAreaUsuario();
 
  const cargarMemorandums = async () => {
    if (!idArea) return;
    if (idArea === null) return;
 
    setLoading(true);
    setError(null);
    try {
      const data = idArea === TODAS_LAS_AREAS
        ? await listarTodos()
        : await listarPorArea(idArea);
      setMemorandums(data);
    } catch (err) {
      setError(err.message);
      console.error('Error al cargar memorandums por área:', err);
    } finally {
      setLoading(false);
    }
  };
 
  useEffect(() => {
    if (idArea !== null) cargarMemorandums();
  }, [idArea]);
 
  return { memorandums, loading, error, recargar: cargarMemorandums, areaForzada: idArea };
};
 