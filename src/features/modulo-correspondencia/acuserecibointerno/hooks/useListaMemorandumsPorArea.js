import { useState, useEffect } from 'react';
import { useAreaUsuario, TODAS_LAS_AREAS } from '@/shared/hooks/useAreaUsuario';
import axios from 'axios';
import API_BASE_URL from '@/shared/config/api';
 
export const useListaMemorandumsPorArea = () => {
  const [memorandums, setMemorandums] = useState([]);
  const [loading, setLoading]         = useState(false);
  const [error, setError]             = useState(null);
 
  const idArea = useAreaUsuario();
 
  const cargarMemorandums = async () => {
    if (!idArea) return;
    setLoading(true);
    setError(null);
    try {
      const url = idArea === TODAS_LAS_AREAS
        ? `${API_BASE_URL}/memorandums/asignados/todos`
        : `${API_BASE_URL}/memorandums/asignados/area/${idArea}`;
      const { data } = await axios.get(url);
      setMemorandums(Array.isArray(data) ? data : data.content ?? []);
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