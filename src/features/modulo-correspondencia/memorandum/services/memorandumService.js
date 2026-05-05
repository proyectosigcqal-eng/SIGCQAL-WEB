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
    };

    return true;
};
    // Añade esto a tu memorandumService.js

export const registrarSeguimiento = async (idMemo, datosSeguimiento) => {
    const formData = new FormData();
    
    // Los nombres de las llaves ('folio_respuesta', etc.) DEBEN coincidir 
    // exactamente con los @RequestParam o el modelo de tu backend en Java.
    formData.append('folio_respuesta', datosSeguimiento.folioRespuesta);
    formData.append('respuesta_seguimiento_memorandum', datosSeguimiento.respuestaSeguimiento);
    formData.append('archivo_adjunto', datosSeguimiento.archivoAdjunto); 
    
    // NOTA: id_usuario, fecha_resolucion, hora_resolucion y estatus 
    // lo debe calcular y asignar tu backend en automático.

    const response = await fetch(`${API_URL}/memorandums/${idMemo}/seguimiento`, {
        method: 'POST',
        body: formData 
    });

    if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Error al registrar el seguimiento en la base de datos');
    }
    return await response.json();
};
