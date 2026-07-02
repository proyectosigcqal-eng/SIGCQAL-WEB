import { useState, useEffect } from 'react';
import axios from 'axios';

const API = 'http://localhost:8081/SIGCQAL_Prod/api/v1';

export const useListaOficiosPorArea = () => {
  const [oficios, setOficios] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const AREA_FORZADA = 1; 

  const cargarOficios = async (idArea) => {
    setLoading(true);
    setError(null);
    try {
      const res = await axios.get(`${API}/acuse-oficio/area/${idArea}`);
      setOficios(res.data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    cargarOficios(AREA_FORZADA);
  }, []);

  return { oficios, loading, error, recargar: () => cargarOficios(AREA_FORZADA), areaForzada: AREA_FORZADA };
};