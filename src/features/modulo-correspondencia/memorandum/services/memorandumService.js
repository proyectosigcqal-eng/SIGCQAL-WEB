import axios from 'axios';


const API_URL = 'http://localhost:8081/SIGCQAL_dev/api/v1/memorandums';

/**
 * 
 * @param {MemorandumRequestDTO} memorandumDTO 
 * @returns {Promise<MemorandumResponseDTO>}
 */
export const generarMemorandum = async (memorandumDTO) => {
    try {
        const response = await axios.post(`${API_URL}/generar`, memorandumDTO);
        return response.data;
    } catch (error) {
        console.error("Error al generar memorándum:", error.response?.data || error.message);
        throw error;
    }
};


export const listarMemorandums = async () => {
    try {

        const response = await axios.get(`${API_URL}/listar`);
        return response.data;
    } catch (error) {
        console.error("Error al listar:", error.message);
        throw error;
    }
};

export const obtenerMemorandumPorId = async (id) => {
    try {

        const response = await axios.get(`${API_URL}/${id}`);
        return response.data;
    } catch (error) {
        console.error("Error al obtener detalle:", error.message);
        throw error;
    }
};


export const listarPorArea = async (idArea) => {
    try {
        const response = await axios.get(`${API_URL}/area/${idArea}`);
        return response.data;
    } catch (error) {
        console.error("Error al obtener por área:", error.message);
        throw error;
    };
};

export const finalizarAsignacion = async (id, archivo) => {
    const formData = new FormData();
    formData.append('archivo', archivo); 

    const response = await fetch(`${API_URL}/${id}/finalizar`, {
        method: 'POST',
        body: formData,
        
    });

    if (!response.ok) {
        throw new Error('Error al subir el documento firmado');
    }

    return true;
};