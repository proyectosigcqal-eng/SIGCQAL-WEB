import axios from 'axios';

// Usamos la URL base que confirmaste anteriormente
const API_URL = 'http://localhost:8081/SIGCQAL_dev/api';

/**
 * Obtiene la bitácora completa de un expediente/queja por su ID
 * @param {number|string} idQueja 
 */
export const getBitacoraPorQueja = async (idQueja) => {
    try {
        const response = await axios.get(`${API_URL}/bitacora/${idQueja}`, {
            headers: {
                'Content-Type': 'application/json',
            },
        });
        
        return response.data;
    } catch (error) {
        console.error('Error al obtener la bitácora histórica:', error);
        throw error;
    }
};