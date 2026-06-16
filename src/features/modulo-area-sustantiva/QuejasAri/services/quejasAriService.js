import axios from 'axios';
import API_BASE_URL from '@/shared/config/api';

const API_URL = `${API_BASE_URL}/quejas-ari`;

/**
 * Crear una nueva Queja ARI
 * @param {Object} payload - Datos de la queja ARI
 * @returns {Promise<Object>} Respuesta del servidor
 */
export const crearQuejaAri = async (payload) => {
    try {
        const response = await axios.post(`${API_URL}/generar`, payload);
        return response.data;
    } catch (error) {
        console.error("Error al crear queja ARI:", error.response?.data || error.message);
        throw error;
    }
};



/**
 * Obtener Queja ARI por ID
 * @param {number} id
 * @returns {Promise<Object>}
 */
export const obtenerQuejaAriPorId = async (id) => {
    try {
        const response = await axios.get(`${API_URL}/${id}`);
        return response.data;
    } catch (error) {
        console.error("Error al obtener queja ARI:", error.message);
        throw error;
    }
};

/**
 * Listar Quejas ARI por área
 * @param {number} idArea
 * @param {Object} options - { page, size }
 * @returns {Promise<Array>}
 */
export const listarPorArea = async (idArea, options = {}) => {
    try {
        const { page, size } = options;
        let url = `${API_URL}/area/${idArea}`;
        const params = new URLSearchParams();
        if (typeof page !== 'undefined' && page !== null) params.append('page', String(page));
        if (typeof size !== 'undefined' && size !== null) params.append('size', String(size));
        if ([...params].length) url += `?${params.toString()}`;

        const response = await axios.get(url);
        const data = response.data;

        if (Array.isArray(data)) return data;
        if (data && Array.isArray(data.content)) return data.content;
        if (data && Array.isArray(data.items)) return data.items;
        return data;
    } catch (error) {
        console.error("Error al obtener quejas por área:", error.message);
        throw error;
    }
};
