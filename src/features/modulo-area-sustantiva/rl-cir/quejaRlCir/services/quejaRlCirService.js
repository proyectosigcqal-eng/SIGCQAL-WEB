import axios from 'axios';
import API_BASE_URL from '@/shared/config/api';

const API_URL = `${API_BASE_URL}/queja-rl-cir`;


const API = import.meta.env.VITE_API_URL ?? 'http://localhost:8081/SIGCQAL_dev';
const API_RESOLUCION_FINAL = `${API}/api/modulo-area-sustantiva/resolucion-final`;

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


export const obtenerResolucionPorId = async (id) => {
    try {
        const response = await axios.get(`${API_RESOLUCION_FINAL}/${id}`);
        return response.data;
    } catch (error) {
        console.error("Error al obtener resolución final por ID:", error.response?.data || error.message);
        throw error;
    }
};

/**
 * OPCIONAL: Descargar el archivo directamente desde el FileDownloadController usando Axios
 * @param {string} nombreArchivo - Ejemplo: "QUEJA_RL_CIR_RES_1.docx"
 * @returns {Promise<Blob>}
 */
export const descargarQuejaDocxPorNombre = async (nombreArchivo) => {
    try {
        // Apunta al FileDownloadController que acabamos de corregir en el back
        const response = await axios.get(`${API_BASE_URL}/api/files/queja-rl-cir/${nombreArchivo}`, {
            responseType: 'blob' 
        });
        return response.data;
    } catch (error) {
        console.error("Error al descargar el documento DOCX:", error);
        throw error;
    }
};