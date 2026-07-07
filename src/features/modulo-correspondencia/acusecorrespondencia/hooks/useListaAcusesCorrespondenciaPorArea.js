// useListaAcusesCorrespondenciaPorArea.js
import { useState, useEffect } from 'react';
import { listarAcusesPorArea, listarTodos } from '../services/acusecorrespondenciaService';
import { useAreaUsuario, TODAS_LAS_AREAS } from '@/shared/hooks/useAreaUsuario';

export const useListaAcusesCorrespondenciaPorArea = () => {
  const [acuses, setAcuses]   = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError]     = useState(null);

  const idArea = useAreaUsuario();

  const cargarAcuses = async () => {
    if (!idArea) return; // ← guard: no fetchear si no hay área
    setLoading(true);
    setError(null);
    try {
      const data = idArea === TODAS_LAS_AREAS
              ? await listarTodos()
              : await listarPorArea(idArea);
      setAcuses(data);
    } catch (err) {
      setError(err.message);
      console.error('Error al cargar acuses de correspondencia por área:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (idArea !== null) cargarAcuses();
  }, [idArea]);

  return { acuses, loading, error, recargar: cargarAcuses, areaForzada: idArea };
};