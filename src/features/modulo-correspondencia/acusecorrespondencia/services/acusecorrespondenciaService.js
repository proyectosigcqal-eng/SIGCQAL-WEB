import axios from 'axios';

const API_URL = 'http://localhost:8081/SIGCQAL_Prod/api/v1/acuse-correspondencia';

/**
 * Crea un nuevo acuse de correspondencia
 * @param {AcuseCorrespondenciaRequestDTO} request
 * @returns {Promise<void>}
 */
export const crearAcuseCorrespondencia = async (request) => {
    // 1. Obtener token de donde sea que esté guardado
    let token = localStorage.getItem('token');
    if (!token) {
        const user = JSON.parse(localStorage.getItem('user') || '{}');
        token = user.token;
    }

    if (!token) throw new Error("No hay token disponible");

    // 2. Limpieza CRÍTICA:
    // A veces el token trae basura pegada si se concatena mal. 
    // Nos aseguramos de tomar solo la parte que parece JWT (que empieza con eyJ)
    const jwtMatch = token.match(/(eyJ[a-zA-Z0-9_-]+\.[a-zA-Z0-9_-]+\.[a-zA-Z0-9_-]+)/);
    const tokenLimpio = jwtMatch ? jwtMatch[0] : token;

    try {
        const response = await axios.post(API_URL, request, {
            headers: { 
                // Aseguramos el espacio entre Bearer y el token
                'Authorization': `Bearer ${tokenLimpio}`,
                'Content-Type': 'application/json'
            }
        });
        return response.data;
    } catch (error) {
        console.error("Error al enviar al backend:", error.response?.data || error.message);
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