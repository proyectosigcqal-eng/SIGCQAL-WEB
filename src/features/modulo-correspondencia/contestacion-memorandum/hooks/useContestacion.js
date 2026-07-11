import { useState, useEffect } from 'react';
import { obtenerMemorandumPorId } from '../../memorandum/services/memorandumService';

export const useContestacion = (idMemo) => {
  const [acuse, setAcuse]           = useState(null);
  const [memorandum, setMemorandum] = useState(null);
  const [loading, setLoading]       = useState(true);
  const [error, setError]           = useState(null);

  useEffect(() => {
    if (!idMemo) return;
    const cargar = async () => {
      try {
        setLoading(true);
        const memoData = await obtenerMemorandumPorId(idMemo);
        setMemorandum(memoData);
        setAcuse({
          idMemorandum:      memoData.id,
          idCorrespondencia: memoData.idCorrespondencia,
          folioUnico:        memoData.folioUnico,
        });
      } catch (err) {
        setError(err.message || 'Error al cargar memorandum');
      } finally {
        setLoading(false);
      }
    };
    cargar();
  }, [idMemo]);

  return { acuse, memorandum, loading, error };
};