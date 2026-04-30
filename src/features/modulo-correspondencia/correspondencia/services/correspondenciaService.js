import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:8081/SIGCQAL_dev'
});

const PATH = '/api/v1/correspondencias/entrada';

export const registrarCorrespondencia = async (dto) => {
  try {
    const response = await api.post(PATH, dto);
    return response.data;
  } catch (error) {
    console.error('Error al registrar correspondencia:', error);
    throw error;
  }
};

export const obtenerCorrespondenciaPorId = async (id) => {
  try {
    const response = await api.get(`${PATH}/${id}`);
    return response.data;
  } catch (error) {
    console.error('Error al obtener correspondencia por id:', error);
    throw error;
  }
};

export const listarCorrespondencias = async () => {
  try {
    const response = await api.get(PATH);
    return response.data;
  } catch (error) {
    console.error('Error al listar correspondencias:', error);
    throw error;
  }
};
