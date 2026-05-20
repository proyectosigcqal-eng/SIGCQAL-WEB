import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { obtenerCorrespondenciaPorId, obtenerProximoFolio } from '../services/seguimientoService';

export const useContestacionCorrespondencia = () => {
  const { id } = useParams();
  const [correspondencia, setCorrespondencia] = useState(null);
  const [loading, setLoading]                 = useState(true);
  const [error, setError]                     = useState(null);

  useEffect(() => {
    if (!id) return;
    const cargar = async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await obtenerCorrespondenciaPorId(id);
        setCorrespondencia(data?.data || data?.resultado || data);
      } catch (err) {
        setError(err.message || 'No se pudo cargar la correspondencia');
      } finally {
        setLoading(false);
      }
    };
    cargar();
  }, [id]);

  return { correspondencia, loading, error };
};