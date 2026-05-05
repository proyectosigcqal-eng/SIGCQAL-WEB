import { useState, useEffect } from 'react';
import { listarAcusesPorArea } from '../services/acusecorrespondenciaService';

export const useListaAcusesCorrespondenciaPorArea = () => {
  const [acuses, setAcuses] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // TODO: Obtener el área del usuario logueado
  // Por ahora se fuerza un área para pruebas
  const AREA_FORZADA = 1;

  const cargarAcuses = async (idArea) => {
    setLoading(true);
    setError(null);
    try {
      const data = await listarAcusesPorArea(idArea);
      console.log('Acuses de correspondencia por área recibidos de la API:', data);
      console.log('Primer acuse (keys):', data.length > 0 ? Object.keys(data[0]) : 'sin datos');
      setAcuses(data);
    } catch (err) {
      setError(err.message);
      console.error("Error al cargar acuses de correspondencia por área:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    cargarAcuses(AREA_FORZADA);
  }, []);

  const recargar = () => {
    cargarAcuses(AREA_FORZADA);
  };

  return {
    acuses,
    loading,
    error,
    recargar,
    areaForzada: AREA_FORZADA
  };
};