import axios from 'axios';
import API_BASE_URL from '@/shared/config/api';


const API = 'http://localhost:8081/SIGCQAL_dev/api/v1';

const API_SEGUIMIENTO_URL = `${API_BASE_URL}/seguimiento-correspondencia`;
const API_CORRESPONDENCIA_URL = `${API_BASE_URL}/correspondencias/entrada`;


/**
 * Obtiene los detalles de la correspondencia base por su ID
 */
export const obtenerCorrespondenciaPorId = async (id) => {
  const res = await axios.get(`${API}/correspondencias/entrada/${id}`);
  return res.data;
};

/**
 * Guarda el seguimiento de correspondencia empaquetando todo en FormData
 * (Soporta archivos binarios automáticamente a través de Axios)
 */
export const guardarSeguimiento = async (payload) => {
  const formData = new FormData();

  // Mapeo directo respetando las propiedades del SeguimientoCorrespondenciaRequestDTO de Java
  formData.append('idCorrespondencia', payload.idCorrespondencia);
  formData.append('folioRespuesta', payload.folioRespuesta);
  formData.append('respuestaSeguimientoCorrespondencia', payload.respuestaSeguimientoCorrespondencia);
  formData.append('fechaResolucion', payload.fechaResolucion);
  formData.append('horaResolucion', payload.horaResolucion);
  formData.append('idUsuario', payload.idUsuario || 2); 
  formData.append('idEstatus', payload.idEstatus || 4);
  formData.append('numeroOficioContestacion', payload.numeroOficioContestacion); // ¡El nuevo campo estrella!

  // Si el usuario seleccionó un archivo físico en el input, se adjunta
  if (payload.archivoAdjunto) {
    formData.append('archivoAdjunto', payload.archivoAdjunto);
  }

  const res = await axios.post(`${API}/seguimiento-correspondencia/guardar`, formData, {
    headers: { 'Content-Type': 'multipart/form-data' }
  });
  return res.data;
};

/**
 * Lista todos los seguimientos globales de correspondencia (Para calcular el folio)
 */
export const listarSeguimientosCorrespondencia = async () => {
  const res = await axios.get(`${API}/seguimiento-correspondencia/listar`);
  return res.data;
};

/**
 * Lista los seguimientos asociados a una correspondencia en específico
 */
export const listarSeguimientosPorCorrespondencia = async (id) => {
  const res = await axios.get(`${API}/seguimiento-correspondencia/correspondencia/${id}`);
  return res.data;
};

/**
 * Genera el próximo folio con el prefijo "CC" (Contestación Correspondencia)
 * de forma idéntica a como lo hace el módulo de memorándums
 */
export const obtenerProximoFolio = async () => {
  const res = await axios.get(`${API}/seguimiento-correspondencia/listar`);
  const total = res.data.length;
  const proximo = total + 1;
  const anio = new Date().getFullYear();
  return `CC-${String(proximo).padStart(6, '0')}-${anio}`;
};