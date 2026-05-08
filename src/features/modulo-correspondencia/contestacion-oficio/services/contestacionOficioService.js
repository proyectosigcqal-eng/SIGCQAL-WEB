import axios from 'axios';

const API = 'http://localhost:8081/SIGCQAL_dev/api/v1';

export const obtenerAcuseOficioPorId = async (id) => {
  const res = await axios.get(`${API}/acuse-oficio/${id}`);
  return res.data;
};

export const guardarSeguimientoOficio = async (formData) => {
  const res = await axios.post(`${API}/seguimiento-oficio/guardar`, formData, {
    headers: { 'Content-Type': 'multipart/form-data' }
  });
  return res.data;
};

export const listarSeguimientosOficio = async () => {
  const res = await axios.get(`${API}/seguimiento-oficio/listar`);
  return res.data;
};

export const listarSeguimientosPorOficio = async (id) => {
  const res = await axios.get(`${API}/seguimiento-oficio/oficio/${id}`);
  return res.data;
};