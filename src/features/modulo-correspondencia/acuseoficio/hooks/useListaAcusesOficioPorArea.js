import { useState, useEffect } from 'react';
import axios from 'axios';
import { listarAcusesPorArea, listarTodos } from '../services/acuseoficioService';
import { useAreaUsuario, TODAS_LAS_AREAS } from '@/shared/hooks/useAreaUsuario';
 
const API = 'http://localhost:8081/SIGCQAL_Prod/api/v1';
 
export const useListaAcusesOficioPorArea = () => {
  const [oficios, setOficios] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError]     = useState(null);
 
  const idArea = useAreaUsuario();
 
  const cargarOficios = async () => {
    if (!idArea) return;
    if (idArea === null) return;
 
    setLoading(true);
    setError(null);
    try {
      // Admin → endpoint sin filtro de área (ajusta la URL si tu backend la tiene)
       const data = idArea === TODAS_LAS_AREAS
                    ? await listarTodos()
                    : await listarAcusesPorArea(idArea);
      setOficios(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };
 
  useEffect(() => {
    if (idArea !== null) cargarOficios();
  }, [idArea]);
 
  return { oficios, loading, error, recargar: cargarOficios, areaForzada: idArea };
};