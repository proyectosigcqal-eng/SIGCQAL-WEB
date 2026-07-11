import { useState, useEffect } from 'react';
import { listarPorArea, listarTodosPendientesOficios } from '../../oficio/services/oficioService';
import { useAreaUsuario, TODAS_LAS_AREAS } from '@/shared/hooks/useAreaUsuario';

export const useListaOficios = () => {
  const [oficios, setOficios]   = useState([]);
  const [loading, setLoading]   = useState(false);
  const [error, setError]       = useState(null);

  const idArea = useAreaUsuario();

  const cargar = async () => {
    if (!idArea) return;
    setLoading(true);
    setError(null);
    try {
      const data = idArea === TODAS_LAS_AREAS
        ? await listarTodosPendientesOficios()  // ← cambia listarOficios por este
        : await listarPorArea(idArea);
      setOficios(Array.isArray(data) ? data : data.content ?? []);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { cargar(); }, [idArea]);

  return { oficios, loading, error, recargar: cargar, areaForzada: idArea };
};