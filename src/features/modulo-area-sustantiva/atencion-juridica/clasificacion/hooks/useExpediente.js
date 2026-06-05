import { useEffect, useMemo, useState } from 'react';
import axios from 'axios';
import { endpoint } from '@/shared/config/api';

const isNonEmpty = (value) => value !== undefined && value !== null && String(value).trim() !== '';

const getApiErrorMessage = (err) => {
  const data = err?.response?.data;
  if (typeof data === 'string' && data.trim()) return data;
  return data?.message || data?.error || err?.message || 'Error al cargar el expediente.';
};

const pickFirst = (obj, keys) => {
  for (const key of keys) {
    const value = obj?.[key];
    if (isNonEmpty(value)) return value;
  }
  return null;
};

const pickMapValue = (map, keys) => {
  if (!map || typeof map !== 'object') return null;
  for (const key of keys) {
    const value = map[key];
    if (isNonEmpty(value)) return value;
  }
  return null;
};

const mapDetalleToViewModel = (data) => {
  if (!data || typeof data !== 'object') return null;

  const folio = pickFirst(data, ['folio', 'folioGobierno', 'folio_gobierno']);

  const datosContribuyente =
    data?.bitacora?.registro?.datosContribuyente || data?.bitacora?.registro?.datos_contribuyente;

  const nombreContribuyente =
    pickFirst(data, ['contribuyente', 'nombreContribuyente', 'nombreCompleto']) ||
    pickMapValue(datosContribuyente, ['Nombre', 'NOMBRE']);

  const estatus =
    pickFirst(data, ['estatusActual', 'estatus_actual']) ||
    pickFirst(data?.analisisLegal, ['estatusExpediente', 'estatus_expediente']) ||
    pickFirst(data?.analisis_legal, ['estatusExpediente', 'estatus_expediente']);

  const idExpedienteNum = Number(folio);

  return {
    idExpediente: Number.isFinite(idExpedienteNum) ? idExpedienteNum : null,
    folioGobierno: folio || null,
    nombreContribuyente: nombreContribuyente || null,
    nombreTramite: 'Atención Jurídica',
    estatus: estatus || null,
    rfc: pickFirst(data, ['rfc']) || pickMapValue(datosContribuyente, ['RFC']),
    curp: pickFirst(data, ['curp']) || pickMapValue(datosContribuyente, ['CURP']),
    domicilio: pickFirst(data, ['domicilio', 'direccion']) || null,
    telefono:
      pickFirst(data, ['telefono']) ||
      pickMapValue(datosContribuyente, ['Teléfono', 'Telefono', 'TELÉFONO', 'TELEFONO']),
    correoElectronico:
      pickFirst(data, ['correoElectronico', 'correo', 'email']) ||
      pickMapValue(datosContribuyente, ['Correo', 'CORREO', 'Email', 'EMAIL']),
    fechaRegistro:
      pickFirst(data, [
        'fechaRegistro',
        'fecha_registro',
        'fecha_registro_sistema',
        'fechaApertura',
        'fecha_apertura',
      ]) || null,
  };
};

export const useExpediente = (idExpediente) => {
  const [detalle, setDetalle] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!idExpediente) {
      setDetalle(null);
      setError(null);
      return;
    }

    let cancelled = false;

    (async () => {
      setError(null);
      try {
        const url = endpoint(`/expedientes/${idExpediente}/detalle-asesoria`);
        const response = await axios.get(url);
        const mapped = mapDetalleToViewModel(response.data);
        if (!cancelled) setDetalle(mapped);
      } catch (err) {
        if (!cancelled) {
          setDetalle(null);
          setError(getApiErrorMessage(err));
        }
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [idExpediente]);

  const expedientes = useMemo(() => (detalle ? [detalle] : []), [detalle]);

  const actualizarExpediente = (partial) => {
    if (!idExpediente) return;
    setDetalle((prev) => (prev ? { ...prev, ...partial } : prev));
  };

  return { expediente: detalle, expedientes, actualizarExpediente, error };
};

