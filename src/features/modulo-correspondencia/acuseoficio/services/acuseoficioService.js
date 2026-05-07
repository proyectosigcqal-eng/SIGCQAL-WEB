import axios from 'axios';

const API_URL = 'http://localhost:8081/SIGCQAL_dev/api/v1/acuse-oficio';

/**
 * Crea un nuevo acuse de oficio
 * @param {AcuseOficioRequestDTO} request
 * @returns {Promise<AcuseOficioResponseDTO>}
 */
export const crearAcuseOficio = async (request) => {
  try {
    const response = await axios.post(`${API_URL}/crear`, request);
    return response.data;
  } catch (error) {
    console.error('Error al crear acuse de oficio:', error.response?.data || error.message);
    throw error;
  }
};

/**
 * Lista los acuses de oficio por área
 * @param {number} idArea
 * @returns {Promise<AcuseOficioResponseDTO[]>}
 */
export const listarAcusesPorArea = async (idArea) => {
  try {
    const response = await axios.get(`${API_URL}/area/${idArea}`);
    return response.data;
  } catch (error) {
    console.error('Error al listar acuses de oficio por área:', error.response?.data || error.message);
    throw error;
  }
};
