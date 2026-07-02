import axios from 'axios';
import API_BASE_URL from '@/shared/config/api';

const API_CORRESPONDENCIA_URL = `${API_BASE_URL}/correspondencias/entrada`;
const API_SEGUIMIENTO_URL = `${API_BASE_URL}/seguimiento-correspondencia`;

/**
 * Obtiene los detalles de la correspondencia base por su ID
 */
export const obtenerCorrespondenciaPorId = async (id) => {
  const res = await axios.get(`${API_CORRESPONDENCIA_URL}/${id}`);
  return res.data;
};

/**
 * Guarda el seguimiento de correspondencia empaquetando todo en FormData
 */
export const guardarSeguimiento = async (payload) => {
  const formData = new FormData();

  formData.append('idCorrespondencia', payload.idCorrespondencia);
  formData.append('folioRespuesta', payload.folioRespuesta);
  formData.append('respuestaSeguimientoCorrespondencia', payload.respuestaSeguimientoCorrespondencia);
  formData.append('fechaResolucion', payload.fechaResolucion);
  formData.append('horaResolucion', payload.horaResolucion);
  formData.append('idUsuario', payload.idUsuario);
  formData.append('idEstatus', payload.idEstatus || 4);
  formData.append('numeroOficioContestacion', payload.numeroOficioContestacion);

  if (payload.archivoAdjunto) {
    formData.append('archivoAdjunto', payload.archivoAdjunto);
  }

  const res = await axios.post(`${API_SEGUIMIENTO_URL}/guardar`, formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
  return res.data;
};

export const listarSeguimientosCorrespondencia = async () => {
  const res = await axios.get(`${API_SEGUIMIENTO_URL}/listar`);
  return res.data;
};

export const listarSeguimientosPorCorrespondencia = async (id) => {
  const res = await axios.get(`${API_SEGUIMIENTO_URL}/correspondencia/${id}`);
  return res.data;
};

export const obtenerProximoFolio = async () => {
  const res = await axios.get(`${API_SEGUIMIENTO_URL}/listar`);
  const total = res.data.length;
  const proximo = total + 1;
  const anio = new Date().getFullYear();
  return `CC-${String(proximo).padStart(6, '0')}-${anio}`;
};
