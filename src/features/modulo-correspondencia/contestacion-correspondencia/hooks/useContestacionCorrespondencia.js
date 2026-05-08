import { useCallback, useState } from 'react';
import { guardarSeguimiento, obtenerCorrespondenciaPorId } from '../services/seguimientoService';

const formatDate = (date) => date.toISOString().split('T')[0];

const formatTime = (date) =>
  date.toLocaleTimeString('es-MX', {
    hour12: false,
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
  });

const formatTimestamp = (date) => date.toISOString().slice(0, 19).replace('T', ' ');

const unwrapCorrespondencia = (data) => {
  if (!data) return null;
  if (data.data) return data.data;
  if (data.resultado) return data.resultado;
  return data;
};

export const useContestacionCorrespondencia = () => {
  const [correspondencia, setCorrespondencia] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const cargarDetalle = useCallback(async (id) => {
    setIsLoading(true);
    setError('');
    try {
      const data = await obtenerCorrespondenciaPorId(id);
      setCorrespondencia(unwrapCorrespondencia(data));
    } catch (err) {
      setError(err.message || 'No se pudo cargar la correspondencia');
    } finally {
      setIsLoading(false);
    }
  }, []);

  const registrarContestacion = useCallback(async ({ idCorrespondencia, folioRespuesta, respuestaSeguimiento, archivoAdjunto }) => {
    setIsLoading(true);
    setError('');

    const now = new Date();
    const payload = {
      id_correspondencia: Number(idCorrespondencia),
      folio_respuesta: folioRespuesta,
      respuesta_seguimiento_correspondencia: respuestaSeguimiento,
      archivo_adjunto: archivoAdjunto,
      fecha_resolucion: formatDate(now),
      hora_resolucion: formatTime(now),
      id_usuario: 2, //TODO: cambiar por el id del usuario logueado
      id_estatus: 4,
      fecha_registro: formatTimestamp(now),
    };

    try {
      await guardarSeguimiento(payload);
      return { success: true };
    } catch (err) {
      const message = err.message || 'No se pudo guardar el seguimiento';
      setError(message);
      return { success: false, message };
    } finally {
      setIsLoading(false);
    }
  }, []);

  return {
    correspondencia,
    isLoading,
    error,
    cargarDetalle,
    registrarContestacion,
  };
};
