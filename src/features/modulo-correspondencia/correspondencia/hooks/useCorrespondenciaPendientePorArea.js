import { useState, useEffect } from 'react';
import { obtenerCorrespondenciaPendientePorArea } from '../services/correspondenciaService';

export const useCorrespondenciaPendientePorArea = () => {
  const [correspondencia, setCorrespondencia] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // TODO: Obtener el área del usuario logueado.
  // Por ahora se fuerza un área para pruebas.
  const AREA_FORZADA = 1;

  const cargarCorrespondencia = async (idArea) => {
    setLoading(true);
    setError(null);
    try {
      const data = await obtenerCorrespondenciaPendientePorArea(idArea);
      console.log('Correspondencia pendiente por área recibida:', data);
      console.log('Primer elemento (keys):', data.length > 0 ? Object.keys(data[0]) : 'sin datos');
      setCorrespondencia(data);
    } catch (err) {
      setError(err?.message || 'Error al obtener correspondencia pendiente por área');
      console.error('Error al cargar correspondencia pendiente por área:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    cargarCorrespondencia(AREA_FORZADA);
  }, []);

  const recargar = () => {
    cargarCorrespondencia(AREA_FORZADA);
  };

  return {
    correspondencia,
    loading,
    error,
    recargar,
    areaForzada: AREA_FORZADA
  };
};
