import { useState } from 'react';
import axios from 'axios';
import { API_HOST } from '@/shared/config/api';

const CLASIFICACION_JURIDICA_URL = `${API_HOST}/api/clasificacion-juridica`;

export const useClasificacion = (idExpediente) => {
  const [guardando, setGuardando] = useState(false);
  const [error, setError] = useState(null);
  const [exito, setExito] = useState(false);
  const [mensaje, setMensaje] = useState(null);

  const confirmarClasificacion = async (datos) => {
    const {
      idAutoridadFiscal,
      idTipoActo,
      idCalificacionActo,
      idTipoAsesoria,
      problematica,
      seguimientoAsesoria,
      monto,
      idTipoEntrada,
      idEstatusDetalleExpediente,
      calificacionActo,
      nombreAutoridad,
      nombreTipoActo,
      nombreEstatusDetalle,
      nombreTipoEntrada,
    } = datos || {};
    if (!idAutoridadFiscal || !idTipoActo || !idCalificacionActo || !idTipoAsesoria) {
      const msg = 'Todos los campos son obligatorios.';
      setMensaje(msg);
      setError(msg);
      return { ok: false, message: msg };
    }
    const idExpedienteNum = Number(idExpediente);
    if (!Number.isFinite(idExpedienteNum)) {
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
      const montoNum = Number(monto);
      const payload = {
        idExpediente: idExpedienteNum,
        tipoActo: idTipoActo,
        idAutoridad: idAutoridadFiscal,
        idEstatusDetalleExpediente: idEstatusDetalleExpediente ?? null,
        idTipoEntrada: idTipoEntrada ?? null,
        calificacionActo: calificacionActo ?? null,
        problematica: problematica ?? null,
        seguimientoAsesoria: seguimientoAsesoria ?? null,
        monto: Number.isFinite(montoNum) ? montoNum : null,
        nombreAutoridad: nombreAutoridad ?? null,
        nombreTipoActo: nombreTipoActo ?? null,
        nombreEstatusDetalle: nombreEstatusDetalle ?? null,
        nombreTipoEntrada: nombreTipoEntrada ?? null,
      };

      const response = await axios.post(CLASIFICACION_JURIDICA_URL, payload);
      setExito(true);
      const msg = 'Clasificación confirmada correctamente.';
      setMensaje(msg);
      return { ok: true, message: msg, data: response.data };
    } catch (err) {
      const msg = err?.response?.data?.message || err?.message || 'Error al confirmar la clasificación.';
      setError(msg);
      setMensaje(msg);
      return { ok: false, message: msg };
    } finally {
      setGuardando(false);
    }
  };

  return { confirmarClasificacion, guardando, error, exito, mensaje };
};

