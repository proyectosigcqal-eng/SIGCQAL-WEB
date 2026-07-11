import { useState, useEffect } from 'react';
import { useAreaUsuario, TODAS_LAS_AREAS } from '@/shared/hooks/useAreaUsuario';
import axios from 'axios';
import API_BASE_URL from '@/shared/config/api';
 
export const useListaAcusesOficioPorArea = () => {
  const [acuses, setAcuses] = useState([]);  // ← renombrado a acuses
  const [loading, setLoading] = useState(false);
  const [error, setError]     = useState(null);
 
  const idArea = useAreaUsuario();
 
  const cargarOficios = async () => {
    if (!idArea) return;
    setLoading(true);
    setError(null);
    try {
      const url = idArea === TODAS_LAS_AREAS
        ? `${API_BASE_URL}/oficios/asignados/todos`
        : `${API_BASE_URL}/oficios/asignados/area/${idArea}`;
      const { data } = await axios.get(url);
      setAcuses(Array.isArray(data) ? data : data.content ?? []);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };
 
  useEffect(() => {
    if (idArea !== null) cargarOficios();
  }, [idArea]);
 
  return { acuses, loading, error, recargar: cargarOficios, areaForzada: idArea };
};