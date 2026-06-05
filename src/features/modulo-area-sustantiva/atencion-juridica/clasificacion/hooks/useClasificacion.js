import { useState } from 'react';
import axios from 'axios';
import { endpointApi } from '@/shared/config/api';

const CLASIFICACION_JURIDICA_URL = endpointApi('/clasificacion-juridica');

const getApiErrorMessage = (err) => {
  const data = err?.response?.data;
  if (typeof data === 'string' && data.trim()) return data;
  return data?.message || data?.error || err?.message || 'Error al confirmar la clasificacion.';
};

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

    const camposObligatorios = [idAutoridadFiscal, idTipoActo, idCalificacionActo, idTipoAsesoria].map(Number);
    if (camposObligatorios.some((value) => !Number.isFinite(value) || value <= 0)) {
      const msg = 'Todos los campos son obligatorios.';
      setMensaje(msg);
      setError(msg);
      return { ok: false, message: msg };
    }

    const idExpedienteNum = Number(idExpediente);
    if (!Number.isFinite(idExpedienteNum) || idExpedienteNum <= 0) {
      const msg = 'No se encontro el identificador del expediente.';
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
        tipoActo: Number(idTipoActo),
        tipoAsesoria: Number(idTipoAsesoria),
        idTipoActo: Number(idTipoActo),
        idTipoAsesoria: Number(idTipoAsesoria),
        idCalificacionActo: Number(idCalificacionActo),
        idAutoridad: Number(idAutoridadFiscal),
        idAutoridadFiscal: Number(idAutoridadFiscal),
        idEstatusDetalleExpediente: Number(idEstatusDetalleExpediente),
        idTipoEntrada: Number(idTipoEntrada),
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
      const msg = 'Clasificacion confirmada correctamente.';
      setMensaje(msg);
      return { ok: true, message: msg, data: response.data };
    } catch (err) {
      const msg = getApiErrorMessage(err);
      setError(msg);
      setMensaje(msg);
      return { ok: false, message: msg, data: err?.response?.data };
    } finally {
      setGuardando(false);
    }
  };

  return { confirmarClasificacion, guardando, error, exito, mensaje };
};
