import { useState, useEffect } from 'react';
import { listarPorArea } from '../services/acuserecibointernoService';

export const useListaMemorandumsPorArea = () => {
  const [memorandums, setMemorandums] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // TODO: Obtener el área del usuario logueado
  // Por ahora se fuerza un área para pruebas
  const AREA_FORZADA = 1;

  const cargarMemorandums = async (idArea) => {
    setLoading(true);
    setError(null);
    try {
      const data = await listarPorArea(idArea);
      console.log('Memorandums por área recibidos de la API:', data);
      console.log('Primer memo (keys):', data.length > 0 ? Object.keys(data[0]) : 'sin datos');
      setMemorandums(data);
    } catch (err) {
      setError(err.message);
      console.error("Error al cargar memorandums por área:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    cargarMemorandums(AREA_FORZADA);
  }, []);

  const recargar = () => {
    cargarMemorandums(AREA_FORZADA);
  };

  return {
    memorandums,
    loading,
    error,
    recargar,
    areaForzada: AREA_FORZADA
  };
};
