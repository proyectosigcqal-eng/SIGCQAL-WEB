import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:8081/SIGCQAL_dev'
});

const PATH = '/api/v1/bandeja-entrada';

export const crearBandejaEntrada = async (dto) => {
  try {
    const response = await api.post(PATH, dto);
    return response.data;
  } catch (error) {
    console.error('Error al crear bandeja de entrada:', error);
    throw error;
  }
};

export const listarBandejasPorArea = async (idArea) => {
  try {
    const response = await api.get(`${PATH}/area/${idArea}`);
    return response.data;
  } catch (error) {
    console.error('Error al listar bandejas por área:', error);
    throw error;
  }
};

export const listarTodasBandejas = async () => {
  try {
    const response = await api.get(PATH);
    return response.data;
  } catch (error) {
    console.error('Error al listar todas las bandejas:', error);
    throw error;
  }
};

