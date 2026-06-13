import { useCallback, useEffect, useState } from 'react';
import { controlPlazosAutoridadService } from '../services/controlPlazosAutoridadService';

const getApiErrorMessage = (err) => {
  const data = err?.response?.data;
  if (typeof data === 'string' && data.trim()) return data;
  return data?.message || data?.error || err?.message || 'Error al consultar el plazo de autoridad.';
};

export const usePlazosAutoridad = (expedienteId) => {
  const [semaforo, setSemaforo] = useState(null);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState(null);

  const cargar = useCallback(async () => {
    const id = expedienteId;
    if (!id) return null;

    setError(null);
    setCargando(true);
    try {
      const data = await controlPlazosAutoridadService.obtenerSemaforo(id);
      setSemaforo(data);
      return data;
    } catch (err) {
      const msg = getApiErrorMessage(err);
      setError(msg);
      setSemaforo(null);
      throw err;
    } finally {
      setCargando(false);
    }
  }, [expedienteId]);

  useEffect(() => {
    if (!expedienteId) {
      setCargando(false);
      setSemaforo(null);
      setError(null);
      return;
    }

    cargar();
    const timer = window.setInterval(cargar, 30000);
    return () => window.clearInterval(timer);
  }, [expedienteId, cargar]);

  const registrarInforme = useCallback(
    async (form, pdfFile) => {
      try {
        const resultado = await controlPlazosAutoridadService.registrarInformeRecibido(expedienteId, form, pdfFile);
        await cargar();
        return resultado;
      } catch (err) {
        const msg = getApiErrorMessage(err);
        setError(msg);
        throw err;
      }
    },
    [expedienteId, cargar],
  );

  return { semaforo, cargando, error, registrarInforme, refrescar: cargar };
};

