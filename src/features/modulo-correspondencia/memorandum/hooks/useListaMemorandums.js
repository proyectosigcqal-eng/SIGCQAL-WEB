// useListaMemorandums.js
import { useState, useEffect } from 'react';
import { listarPorArea, listarTodos, listarTodosPendientes } from '../services/memorandumService';
import { useAreaUsuario, TODAS_LAS_AREAS } from '@/shared/hooks/useAreaUsuario';
 
export const useListaMemorandums = () => {
  const [memorandums, setMemorandums] = useState([]);
  const [loading, setLoading]         = useState(false);
  const [error, setError]             = useState(null);
 
  const idArea = useAreaUsuario();
 
  const cargarMemorandums = async () => {
    if (!idArea) return;
    setLoading(true);
    setError(null);
    try {
      const data = idArea === TODAS_LAS_AREAS
        ? await listarTodosPendientes()   // ← cambia listarTodos por este
        : await listarPorArea(idArea);
      setMemorandums(data);
    } catch (err) {
      setError(err.message);
      console.error('Error al cargar memorandums:', err);
    } finally {
      setLoading(false);
    }
  };
 
  useEffect(() => { cargarMemorandums(); }, [idArea]);
 
  return { memorandums, loading, error, recargar: cargarMemorandums, areaForzada: idArea };
};