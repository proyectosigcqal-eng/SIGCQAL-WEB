import { useState, useEffect } from 'react';
import { obtenerAcuseOficioPorId } from '../services/contestacionOficioService';
import { obtenerOficioPorId } from '../../oficio/services/oficioService';

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
        const dataAcuse = await obtenerAcuseOficioPorId(idAcuse);
        setAcuse(dataAcuse);

        // Si existe idOficio, obtener el oficio completo para intentar heredar idCorrespondencia
        if (dataAcuse?.idOficio) {
          try {
            const oficioData = await obtenerOficioPorId(dataAcuse.idOficio);
            setOficio(oficioData);
            if (!dataAcuse?.idCorrespondencia && oficioData?.idCorrespondencia) {
              setAcuse({ ...dataAcuse, idCorrespondencia: oficioData.idCorrespondencia });
            }
          } catch (err) {
            // fallback: usar la respuesta del acuse
            setOficio(dataAcuse);
          }
        } else {
          setOficio(dataAcuse);
        }
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