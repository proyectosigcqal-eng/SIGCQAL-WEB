import { useState } from 'react';

export const useClasificacion = (idExpediente) => {
  const [guardando, setGuardando] = useState(false);
  const [error, setError] = useState(null);
  const [exito, setExito] = useState(false);
  const [mensaje, setMensaje] = useState(null);

  const confirmarClasificacion = async (datos) => {
    const { idAutoridadFiscal, idTipoActo, idCalificacionActo, idTipoAsesoria } = datos || {};
    if (!idAutoridadFiscal || !idTipoActo || !idCalificacionActo || !idTipoAsesoria) {
      const msg = 'Todos los campos son obligatorios.';
      setMensaje(msg);
      setError(msg);
      return { ok: false, message: msg };
    }
    if (!idExpediente) {
      const msg = 'No se encontró el identificador del expediente.';
      setMensaje(msg);
      setError(msg);
      return { ok: false, message: msg };
    }

    setGuardando(true);
    setError(null);
    setExito(false);
    setMensaje(null);
    try {
      await new Promise((r) => setTimeout(r, 250));
      setExito(true);
      const msg = 'Clasificación confirmada correctamente.';
      setMensaje(msg);
      return { ok: true, message: msg };
    } catch (err) {
      const msg = err?.message || 'Error al confirmar la clasificación.';
      setError(msg);
      setMensaje(msg);
      return { ok: false, message: msg };
    } finally {
      setGuardando(false);
    }
  };

  return { confirmarClasificacion, guardando, error, exito, mensaje };
};

