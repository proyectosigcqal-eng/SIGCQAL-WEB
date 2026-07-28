import axios from 'axios';
import API_BASE_URL from '@/shared/config/api';

const API_URL = `${API_BASE_URL}/plantillas`;

/**
 * Genera una plantilla de Word basada en variables dinámicas.
 * @param {string} nombrePlantilla - El nombre identificador de la plantilla
 * @param {Object} variables - Datos clave-valor para los marcadores
 * @returns {Promise<Blob>} El archivo Word en formato Blob
 */
export const generarPlantilla = async (nombrePlantilla, variables) => {
    try {
        const response = await axios.post(
            `${API_URL}/generar/${nombrePlantilla}`,
            variables,
            {
                responseType: 'blob' // Indispensable para que Axios no corrompa el .docx binario
            }
        );
        return response.data;
    } catch (error) {
        console.error(`Error al generar la plantilla ${nombrePlantilla}:`, error.response?.data || error.message);
        throw error;
    }
};