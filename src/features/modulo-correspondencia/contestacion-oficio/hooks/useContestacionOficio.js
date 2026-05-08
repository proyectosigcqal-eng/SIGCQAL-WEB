import { useState, useEffect } from 'react';
import axios from 'axios';

const API = 'http://localhost:8081/SIGCQAL_dev/api/v1';

export const useContestacionOficio = (idAcuse) => {
  const [acuse, setAcuse]     = useState(null);
  const [oficio, setOficio]   = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError]     = useState(null);

  useEffect(() => {
    if (!idAcuse) return;
    const cargar = async () => {
      try {
        setLoading(true);
        // ✅ Llama al acuse, no al oficio directamente
        const data = await axios.get(`${API}/acuse-oficio/${idAcuse}`);
        setAcuse(data.data);
        setOficio(data.data); // ya trae urlOficioGenerado
      } catch (err) {
        setError(err.message || 'Error al cargar acuse de oficio');
      } finally {
        setLoading(false);
      }
    };
    cargar();
  }, [idAcuse]);

  return { acuse, oficio, loading, error };
};