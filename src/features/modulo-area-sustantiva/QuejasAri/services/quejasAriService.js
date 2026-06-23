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
 * Obtiene idQueja / idCir asociados a un folio (para precargar el formulario de ARI)
 * @param {string} folio
 * @returns {Promise<{idQueja: number, idCir: number|null}>}
 */
export const obtenerContextoAriPorFolio = async (folio) => {
  const res = await axios.get(`${API_URL}/contexto/${folio}`);
  return res.data;
};

export const listarAriPorIdQueja = async (idQueja) => {
  const res = await axios.get(`${API_URL}/por-queja/${idQueja}`);
  return res.data;
};

/**
 * Obtener Queja ARI por ID
 * @param {number} id
 * @returns {Promise<Object>} Objeto QuejaResponseDTO enriquecido
 */
export const obtenerQuejaAriPorId = async (idQueja) => {
    try {
        // CAMBIO: Apuntamos a '/quejas' en lugar de '/quejas-ari'
        const response = await axios.get(`${API_URL}/quejas/${idQueja}`);
        
        console.log("=== DATOS ENRIQUECIDOS RECIBIDOS ===", response.data);
        return response.data;
    } catch (error) {
        console.error("Error al obtener datos relacionales desde QuejaController:", error.message);
        // Retornamos null para que el formulario no se rompa y use placeholders si el id no existe
        return null; 
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