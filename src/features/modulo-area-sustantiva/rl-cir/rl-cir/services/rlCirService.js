import axios from 'axios';
import API_BASE_URL from '@/shared/config/api';

const API_URL = `${API_BASE_URL}/rl-cir`;

/**
 * Crear un nuevo registro RL_CIR
 * @param {Object} payload - Datos esperados por el Back-End
 * @returns {Promise<Object>} Respuesta con RLCirResponseDTO
 */
export const crearRLCir = async (payload) => {
    try {
        const response = await axios.post(`${API_URL}/generar`, payload);
        return response.data;
    } catch (error) {
        console.error("Error al crear RL_CIR:", error.response?.data || error.message);
        throw error;
    }
};

/**
 * Listar todos los registros RL_CIR
 * @returns {Promise<Array>}
 */
export const listarRLCir = async () => {
    const res = await axios.get(`${API_URL}/listar`);
    return res.data;
};