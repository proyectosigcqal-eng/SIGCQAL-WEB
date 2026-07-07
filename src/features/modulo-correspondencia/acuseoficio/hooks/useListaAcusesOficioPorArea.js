import { useState, useEffect } from 'react';
import { listarAcusesPorArea } from '../services/acuseoficioService';
import { useAreaUsuario } from '@/shared/hooks/useAreaUsuario';


export const useListaAcusesOficioPorArea = () => {
  const [acuses, setAcuses] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // TODO: Obtener el área del usuario logueado
  const idArea = useAreaUsuario();

  const cargarAcuses = async (idArea) => {
    if (!idArea) return;
    setLoading(true);
    setError(null);
    try {
      const data = await listarAcusesPorArea(idArea);
      console.log('Acuses de oficio por área recibidos de la API:', data);
      setAcuses(data);
    } catch (err) {
      setError(err.message);
      console.error('Error al cargar acuses de oficio por área:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    cargarAcuses(idArea);
  }, [idArea]);

  const recargar = () => {
    cargarAcuses(idArea);
  };

  return {
    acuses,
    loading,
    error,
    recargar,
    areaForzada: idArea
  };
};
