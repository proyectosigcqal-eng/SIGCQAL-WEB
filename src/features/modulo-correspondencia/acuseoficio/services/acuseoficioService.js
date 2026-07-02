import axios from 'axios';
import API_BASE_URL from '@/shared/config/api';

const API_URL = `${API_BASE_URL}/acuse-oficio`;

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
