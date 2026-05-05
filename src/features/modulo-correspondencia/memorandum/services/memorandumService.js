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


/**
 * Listar memorandums por área.
 * Soporta paginación si el backend lo expone (page, size).
 * Si el backend devuelve un objeto paginado ({ content: [...] }), se retorna el array de content.
 * @param {number} idArea
 * @param {{page?: number, size?: number}} [options]
 * @returns {Promise<Array>} arreglo de memorandums
 */
export const listarPorArea = async (idArea, options = {}) => {
    try {
        const { page, size } = options;
        let url = `${API_URL}/pendientesacuse/area/${idArea}`;
        const params = new URLSearchParams();
        if (typeof page !== 'undefined' && page !== null) params.append('page', String(page));
        if (typeof size !== 'undefined' && size !== null) params.append('size', String(size));
        if ([...params].length) url += `?${params.toString()}`;

        const response = await axios.get(url);
        const data = response.data;

        // Caso típico: el backend devuelve un arreglo
        if (Array.isArray(data)) return data;

        // Caso paginado estilo Spring: { content: [...], totalElements, ... }
        if (data && Array.isArray(data.content)) return data.content;

        // Otros wrappers comunes
        if (data && Array.isArray(data.items)) return data.items;

        // Si no es un arreglo conocido, devolver tal cual (podría romper código que espera array)
        return data;
    } catch (error) {
        console.error("Error al obtener por área:", error.message);
        throw error;
    };
};

export const finalizarAsignacion = async (id, archivo, idArea) => {
    const formData = new FormData();
    formData.append('archivo', archivo);
    formData.append('idArea', idArea);

    const response = await fetch(`${API_URL}/${id}/finalizar`, {
        method: 'POST',
        body: formData,
    });

    if (!response.ok) {
        throw new Error('Error al subir el documento firmado');
    }

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
