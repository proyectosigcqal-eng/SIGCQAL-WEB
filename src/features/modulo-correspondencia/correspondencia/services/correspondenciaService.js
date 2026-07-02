import axios from 'axios';
import API_BASE_URL from '@/shared/config/api';

const API_URL = `${API_BASE_URL}/correspondencias/entrada`;

export const registrarCorrespondencia = async (dto) => {
  const response = await axios.post(API_URL, dto);
  return response.data;
};

export const listarCorrespondencias = async () => {
  const response = await axios.get(API_URL);
  return response.data;
};

export const asignarAreaCorrespondencia = async (id, idArea) => {
  const response = await axios.patch(`${API_URL}/${id}`, { idArea });
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

export const listarCorrespondenciasPorTipo = async (idNatural) => {
  const response = await axios.get(
    `${API_URL}/tipo/${idNatural}`
  );
  return response.data;
};
