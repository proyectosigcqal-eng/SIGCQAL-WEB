import { useState, useEffect } from 'react';
import {
  obtenerCorrespondenciaPendientePorArea,
  obtenerTodasCorrespondenciasPendientes,
} from '../services/correspondenciaService';
import { useAreaUsuario, TODAS_LAS_AREAS } from '@/shared/hooks/useAreaUsuario';
 
export const useCorrespondenciaPendientePorArea = () => {
  const [correspondencia, setCorrespondencia] = useState([]);
  const [loading, setLoading]                 = useState(false);
  const [error, setError]                     = useState(null);
 
  const idArea = useAreaUsuario();
 
  const cargarCorrespondencia = async () => {
    if (!idArea) return;
    if (idArea === null) return;
 
    setLoading(true);
    setError(null);
    try {
      const data = idArea === TODAS_LAS_AREAS
        ? await obtenerTodasCorrespondenciasPendientes()
        : await obtenerCorrespondenciaPendientePorArea(idArea);
      setCorrespondencia(data);
    } catch (err) {
      setError(err?.message || 'Error al obtener correspondencia pendiente');
      console.error('Error al cargar correspondencia pendiente:', err);
    } finally {
      setLoading(false);
    }
  };
 
  useEffect(() => {
    if (idArea !== null) cargarCorrespondencia();
  }, [idArea]);
 
  return { correspondencia, loading, error, recargar: cargarCorrespondencia, areaForzada: idArea };
};