import axios from 'axios';
import API_BASE_URL from '@/shared/config/api';
import { formatForBackend, formatTimeForBackend } from '@/shared/utils/dateUtils';

const API_URL = `${API_BASE_URL}/memorandums`;

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
    };
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
    const API_SEGUIMIENTO = `${API_BASE_URL}/seguimiento-memorandum`;
    
    const formData = new FormData();
    formData.append('idMemo', idMemo);  // ← coincide con DTO
    formData.append('respuestaSeguimientoMemorandum', datosSeguimiento.respuestaSeguimiento); // ← coincide con DTO
    formData.append('fechaResolucion', formatForBackend(new Date()));
    formData.append('horaResolucion', formatTimeForBackend(new Date()));
    
    // Archivo es opcional según el DTO
    if (datosSeguimiento.archivoAdjunto) {
        formData.append('archivoAdjunto', datosSeguimiento.archivoAdjunto); // ← coincide con DTO
    }

    const response = await fetch(`${API_SEGUIMIENTO}/guardar`, {  // ← ruta corregida
        method: 'POST',
        // ← Sin Content-Type header — el browser lo asigna con boundary automáticamente
        body: formData
    });

    if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || 'Error al registrar el seguimiento');
    }
    return await response.json();

  
};

// Al final de memorandumService.js, agregar:
export const listarTodos = async (options = {}) => {
    return listarMemorandums();
};

export const listarTodosPendientes = async () => {
  const { data } = await axios.get(`${API_BASE_URL}/memorandums/pendientesacuse/todos`);
  return Array.isArray(data) ? data : data.content ?? [];
};