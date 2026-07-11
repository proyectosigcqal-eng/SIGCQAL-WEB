import { useState, useEffect } from 'react';
import { obtenerOficioPorId } from '../../oficio/services/oficioService';

export const useContestacionOficio = (idOficio) => {
  const [acuse, setAcuse]     = useState(null);
  const [oficio, setOficio]   = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError]     = useState(null);

  useEffect(() => {
    if (!idOficio) return;
    const cargar = async () => {
      try {
        setLoading(true);
        const oficioData = await obtenerOficioPorId(idOficio);
        setOficio(oficioData);
        setAcuse({
          idOficio:          oficioData.id,
          idCorrespondencia: oficioData.idCorrespondencia,
          folioUnico:        oficioData.folioUnico,
        });
      } catch (err) {
        setError(err.message || 'Error al cargar oficio');
      } finally {
        setLoading(false);
      }
    };
    cargar();
  }, [idOficio]);

  return { acuse, oficio, loading, error };
};