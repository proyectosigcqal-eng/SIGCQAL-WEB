import axios from 'axios';

// Asegúrate de que el puerto 8081 y el contexto SIGCQAL_dev sean los correctos de tu server
const API_URL = 'http://localhost:8081/SIGCQAL_dev/api/v1/memorandums';

/**
 * Guarda un nuevo memorándum
 * @param {MemorandumRequestDTO} memorandumDTO 
 * @returns {Promise<MemorandumResponseDTO>}
 */
export const generarMemorandum = async (memorandumDTO) => {
    try {
        // Tu Controller tiene @PostMapping("/generar")
        const response = await axios.post(`${API_URL}/generar`, memorandumDTO);
        return response.data;
    } catch (error) {
        console.error("Error al generar memorándum:", error.response?.data || error.message);
        throw error;
    }
};

/**
 * Obtiene la lista completa de memorándums
 */
export const listarMemorandums = async () => {
    try {
        // Tu Controller tiene @GetMapping("/listar")
        const response = await axios.get(`${API_URL}/listar`);
        return response.data;
    } catch (error) {
        console.error("Error al listar:", error.message);
        throw error;
    }
};

/**
 * Obtiene un memorándum por su ID
 */
export const obtenerMemorandumPorId = async (id) => {
    try {
        // Tu Controller tiene @GetMapping("/{id}")
        const response = await axios.get(`${API_URL}/${id}`);
        return response.data;
    } catch (error) {
        console.error("Error al obtener detalle:", error.message);
        throw error;
    }
};

/**
 * Lista los memorándums de un área específica
 */
export const listarPorArea = async (idArea) => {
    try {
        // Tu Controller tiene @GetMapping("/area/{idArea}")
        const response = await axios.get(`${API_URL}/area/${idArea}`);
        return response.data;
    } catch (error) {
        console.error("Error al obtener por área:", error.message);
        throw error;
    }
};