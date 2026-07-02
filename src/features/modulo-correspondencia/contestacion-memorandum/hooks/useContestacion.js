import { useState, useEffect } from 'react';
import { buildMemorandumPdfPath } from '@/shared/utils/documentoUtils';
import { obtenerAcusePorId } from '../services/contestacionService';
import { obtenerMemorandumPorId } from '../../memorandum/services/memorandumService';

const enrichMemorandumUrls = (memoData, dataAcuse) => {
  if (!memoData) return memoData;

  const idMemorandum = memoData.idMemorandum ?? memoData.id ?? dataAcuse?.idMemorandum ?? null;
  const urlMemorandumGenerado =
    memoData.urlMemorandumGenerado ??
    dataAcuse?.urlMemorandumGenerado ??
    buildMemorandumPdfPath(idMemorandum);

  return { ...memoData, urlMemorandumGenerado };
};

export const useContestacion = (idAcuse) => {
  const [acuse, setAcuse]           = useState(null);
  const [memorandum, setMemorandum] = useState(null);
  const [loading, setLoading]       = useState(true);
  const [error, setError]           = useState(null);

  useEffect(() => {
    if (!idAcuse) return;
    const cargar = async () => {
      try {
        setLoading(true);
        const dataAcuse = await obtenerAcusePorId(idAcuse);
        setAcuse(dataAcuse);

        // Intentar obtener el memorandum original para asegurar idCorrespondencia
        let memoData = null;
        if (dataAcuse?.idMemorandum) {
          try {
            memoData = await obtenerMemorandumPorId(dataAcuse.idMemorandum);
            setMemorandum(enrichMemorandumUrls(memoData, dataAcuse));
            // Si el acuse no trae idCorrespondencia, heredarlo del memorandum
            if (!dataAcuse?.idCorrespondencia && memoData?.idCorrespondencia) {
              setAcuse({ ...dataAcuse, idCorrespondencia: memoData.idCorrespondencia });
            }
          } catch (err) {
            // Si falla obtener el memorandum, usar el acuse como fallback
            setMemorandum(enrichMemorandumUrls(dataAcuse, dataAcuse));
          }
        } else {
          setMemorandum(enrichMemorandumUrls(dataAcuse, dataAcuse));
        }
      } catch (err) {
        setError(err.message || 'Error al cargar acuse de memorandum');
      } finally {
        setLoading(false);
      }
    };
    cargar();
  }, [idAcuse]);

  return { acuse, memorandum, loading, error };
};