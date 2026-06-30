import axios from 'axios';
import API_BASE_URL from '@/shared/config/api';

const API_URL = `${API_BASE_URL}/queja-rl-cir`;

/**
 * Crear un nuevo registro Queja_RL_CIR
 * @param {Object} payload - Datos esperados por el Back-End (QuejaRlCirRequestDTO)
 * @returns {Promise<Object>} Respuesta con QuejaRlCirResponseDTO
 */
export const crearQuejaRlCir = async (payload) => {
    try {
        const response = await axios.post(`${API_URL}/generar`, payload);
        return response.data;
    } catch (error) {
        console.error("Error al crear Queja RL_CIR:", error.response?.data || error.message);
        throw error;
    }
};

/**
 * Listar todos los registros Queja_RL_CIR
 * @returns {Promise<Array>}
 */
export const listarQuejaRlCir = async () => {
    const res = await axios.get(`${API_URL}/listar`);
    return res.data;
};