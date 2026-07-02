import axios from 'axios';
import API_BASE_URL from '@/shared/config/api';

const API_URL = `${API_BASE_URL}/acuse-correspondencia`;

/**
 * Crea un nuevo acuse de correspondencia
 * @param {AcuseCorrespondenciaRequestDTO} request
 * @returns {Promise<void>}
 */
export const crearAcuseCorrespondencia = async (request) => {
  try {
    const response = await axios.post(API_URL, request);
    return response.data;
  } catch (error) {
    console.error("Error al crear acuse de correspondencia:", error.response?.data || error.message);
    throw error;
  }
};

/**
 * Lista los acuses de correspondencia por área
 * @param {number} idArea
 * @returns {Promise<AcuseCorrespondenciaResponseDTO[]>}
 */
export const listarAcusesPorArea = async (idArea) => {
  try {
    const response = await axios.get(`${API_URL}/area/${idArea}`);
    return response.data;
  } catch (error) {
    console.error("Error al listar acuses por área:", error.response?.data || error.message);
    throw error;
  }
};