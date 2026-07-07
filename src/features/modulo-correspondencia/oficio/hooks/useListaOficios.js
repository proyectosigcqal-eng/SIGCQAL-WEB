import { useState, useEffect } from 'react';
import { listarPorArea } from '../services/oficioService';
import { useAreaUsuario } from '@/shared/hooks/useAreaUsuario';

export const useListaOficios = () => {
  const [oficios, setOficios] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // TODO: Obtener el área del usuario logueado
  const idArea = useAreaUsuario();

  const cargarOficios = async (idArea) => {
    if (!idArea) return;
    setLoading(true);
    setError(null);
    try {
      const data = await listarPorArea(idArea, { page: 0, size: 10000 });
      console.log('Oficios recibidos de la API:', data);
      setOficios(data);
    } catch (err) {
      setError(err.message);
      console.error("Error al cargar oficios:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    cargarOficios(idArea);
  }, [idArea]);

  const recargar = () => {
    cargarOficios(idArea);
  };

  return {
    oficios,
    loading,
    error,
    recargar,
    areaForzada: idArea
  };
};
