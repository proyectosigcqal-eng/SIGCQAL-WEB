import axios from 'axios';
import API_BASE_URL from '@/shared/config/api';
import {
  buildSeguimientoMemorandumAdjuntoPath,
  isRutaServidorArchivo,
} from '@/shared/utils/documentoUtils';

const API = API_BASE_URL;

export const obtenerAcusePorId = async (id) => {
  const res = await axios.get(`${API}/acuse-interno/${id}`);
  return res.data;
};

const resolveSeguimientoId = (data) =>
  data?.idSeguimientoMemorandum ?? data?.idSeguimiento ?? data?.id ?? null;

/**
 * POST /api/v1/seguimiento-memorandum/guardar
 * multipart/form-data — campo archivoAdjunto (File PDF, opcional)
 */
export const guardarSeguimientoMemorandum = async (payload) => {
  const formData = new FormData();

  formData.append('idMemo', payload.idMemo);
  formData.append('respuestaSeguimientoMemorandum', payload.respuestaSeguimientoMemorandum);
  formData.append('fechaResolucion', payload.fechaResolucion);
  formData.append('horaResolucion', payload.horaResolucion);
  formData.append('idUsuario', payload.idUsuario);
  formData.append('idEstatus', payload.idEstatus ?? 5);

  if (payload.archivoAdjunto instanceof File) {
    formData.append('archivoAdjunto', payload.archivoAdjunto);
  }

  const res = await axios.post(`${API}/seguimiento-memorandum/guardar`, formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
  return res.data;
};

/**
 * POST /api/v1/seguimiento-memorandum/{idSeguimientoMemorandum}/adjunto
 * Subida de respaldo si guardar no procesó el binario.
 */
export const subirPdfFirmado = async (idSeguimiento, archivo) => {
  if (!idSeguimiento || !archivo) {
    throw new Error('Faltan datos para subir el documento firmado');
  }

  const formData = new FormData();
  formData.append('archivo', archivo);

  const response = await fetch(`${API}/seguimiento-memorandum/${idSeguimiento}/adjunto`, {
    method: 'POST',
    body: formData,
  });

  if (!response.ok) {
    let detail = '';
    try {
      const body = await response.json();
      detail = body.message ?? body.detail ?? body.error ?? '';
    } catch {
      /* respuesta no JSON */
    }
    throw new Error(detail || `Error al subir el documento firmado (HTTP ${response.status})`);
  }

  return true;
};

/**
 * Guarda la contestación y asegura que el adjunto quede en:
 * /api/files/seguimiento-memorandum/{folioFormateado}.pdf
 */
export const guardarSeguimientoConAdjunto = async (payload) => {
  const seguimiento = await guardarSeguimientoMemorandum(payload);

  const archivo = payload.archivoAdjunto instanceof File ? payload.archivoAdjunto : null;
  const idSeguimiento = resolveSeguimientoId(seguimiento);
  const folioFormateado = seguimiento?.folioFormateado ?? null;

  let archivoPath = seguimiento?.archivoAdjunto ?? null;
  const adjuntoEnServidor = isRutaServidorArchivo(archivoPath);

  if (archivo && idSeguimiento && !adjuntoEnServidor) {
    await subirPdfFirmado(idSeguimiento, archivo);
    archivoPath = buildSeguimientoMemorandumAdjuntoPath(folioFormateado);
  } else if (!adjuntoEnServidor && folioFormateado) {
    archivoPath = buildSeguimientoMemorandumAdjuntoPath(folioFormateado);
  }

  return {
    ...seguimiento,
    archivoAdjunto: archivoPath ?? seguimiento?.archivoAdjunto,
  };
};

export const obtenerProximoFolio = async () => {
  const res = await axios.get(`${API}/seguimiento-memorandum/listar`);
  const total = res.data.length;
  const proximo = total + 1;
  const anio = new Date().getFullYear();
  return `CM-${String(proximo).padStart(6, '0')}-${anio}`;
};
