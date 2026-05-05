import axios from 'axios';

const API_URL = 'http://localhost:8081/SIGCQAL_dev/api/v1/correspondencias/entrada';

export const registrarCorrespondencia = async (dto) => {
  const response = await axios.post(API_URL, dto);
  return response.data;
};

export const obtenerCorrespondenciaPorId = async (id) => {
  const response = await axios.get(`${API_URL}/${id}`);
  return response.data;
};

export const obtenerCorrespondenciaPendientePorArea = async (idArea) => {
  const response = await axios.get(`${API_URL}/pendienteacuse/area/${idArea}`);
  return response.data;
};
