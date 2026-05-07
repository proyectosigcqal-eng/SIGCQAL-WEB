import { useState, useEffect } from 'react';
import { listarPorArea } from '../services/oficioService';

export const useListaOficios = () => {
  const [oficios, setOficios] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // TODO: Obtener el área del usuario logueado
  const AREA_FORZADA = 1;

  const cargarOficios = async (idArea) => {
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
    cargarOficios(AREA_FORZADA);
  }, []);

  const recargar = () => {
    cargarOficios(AREA_FORZADA);
  };

  return {
    oficios,
    loading,
    error,
    recargar,
    areaForzada: AREA_FORZADA
  };
};
