import axios from 'axios';

const API_URL = 'http://localhost:8081/SIGCQAL_Prod/api/v1/acuse-interno';

/**
 * Lista los acuses de recibo interno por usuario
 * @param {number} idUsuario 
 * @returns {Promise<AcuseReciboInternoResponseDTO[]>}
 */
export const listarPorUsuario = async (idUsuario) => {
    try {
        const response = await axios.get(`${API_URL}/usuario/${idUsuario}`);
        return response.data;
    } catch (error) {
        console.error("Error al listar acuses por usuario:", error.response?.data || error.message);
        throw error;
    }
};

/**
 * Obtiene el detalle de un acuse de recibo interno
 * @param {number} idAcuse 
 * @returns {Promise<AcuseReciboInternoResponseDTO>}
 */
export const obtenerDetalle = async (idAcuse) => {
    try {
        const response = await axios.get(`${API_URL}/${idAcuse}`);
        return response.data;
    } catch (error) {
        console.error("Error al obtener detalle del acuse:", error.response?.data || error.message);
        throw error;
    }
};

/**
 * Responde a un acuse de recibo interno
 * @param {AcuseReciboInternoRequestDTO} request 
 * @returns {Promise<void>}
 */
export const responderAcuse = async (request) => {
    try {
        const response = await axios.post(`${API_URL}/responder`, request);
        return response.data;
    } catch (error) {
        console.error("Error al responder acuse:", error.response?.data || error.message);
        throw error;
    }
};

/**
 * Lista los acuses de recibo interno por área
 * @param {number} idArea 
 * @returns {Promise<AcuseReciboInternoResponseDTO[]>}
 */
export const listarPorArea = async (idArea) => {
    try {
        const response = await axios.get(`${API_URL}/area/${idArea}`);
        return response.data;
    } catch (error) {
        console.error("Error al listar acuses por área:", error.response?.data || error.message);
        throw error;
    }
};