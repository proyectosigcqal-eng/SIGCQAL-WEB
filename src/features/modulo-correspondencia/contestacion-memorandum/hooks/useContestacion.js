import { useState, useEffect } from 'react';
import { obtenerAcusePorId } from '../services/contestacionService';
import { obtenerMemorandumPorId } from '../../memorandum/services/memorandumService';

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
      // El acuse ya trae los datos del memo, úsalo directamente
      setMemorandum(dataAcuse); // ← ya tiene urlMemorandumGenerado
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };
  cargar();
}, [idAcuse]);

  return { acuse, memorandum, loading, error };
};