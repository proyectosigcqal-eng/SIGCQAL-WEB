import axios from 'axios';


const API_URL = 'http://localhost:8081/SIGCQAL_dev/api/v1/oficios';

/**
 * 
 * @param {OficioRequestDTO} oficioDTO 
 * @returns {Promise<OficioResponseDTO>}
 */
export const generarOficio = async (oficioDTO) => {
    try {
        const response = await axios.post(`${API_URL}/generar`, oficioDTO);
        return response.data;
    } catch (error) {
        console.error("Error al generar oficio:", error.response?.data || error.message);
        throw error;
    }
};


export const listarOficios = async () => {
    try {

        const response = await axios.get(`${API_URL}/listar`);
        return response.data;
    } catch (error) {
        console.error("Error al listar:", error.message);
        throw error;
    }
};

export const obtenerOficioPorId = async (id) => {
    try {

        const response = await axios.get(`${API_URL}/${id}`);
        return response.data;
    } catch (error) {
        console.error("Error al obtener detalle:", error.message);
        throw error;
    }
};


/**
 * Listar oficios por área.
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

        if (Array.isArray(data)) return data;
        if (data && Array.isArray(data.content)) return data.content;
        if (data && Array.isArray(data.items)) return data.items;
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

export const registrarSeguimiento = async (idOficio, datos) => {
    const formData = new FormData();
    formData.append('idOficio',                    idOficio);
    formData.append('respuestasSeguimientoOficio', datos.respuestaSeguimiento);
    formData.append('idEstatus',                   datos.idEstatus || 5);
    formData.append('idUsuario',                   datos.idUsuario || 1);

    if (datos.archivoAdjunto) {
        formData.append('archivoAdjunto', datos.archivoAdjunto);
    }

    const response = await fetch(
        'http://localhost:8081/SIGCQAL_dev/api/v1/seguimiento-oficio/guardar',
        { method: 'POST', body: formData }
    );

    if (!response.ok) throw new Error('Error al registrar el seguimiento de oficio');
    return await response.json();
};

export const crearAcuseOficio = async ({ idOficio, idUsuarioRevisor, esDelArea }) => {
    try {
        const response = await axios.post(
            'http://localhost:8081/SIGCQAL_dev/api/v1/acuse-oficio/crear',
            { idOficio, idUsuarioRevisor, esDelArea }
        );
        return response.data;
    } catch (error) {
        console.error("Error al crear acuse de oficio:", error.response?.data || error.message);
        throw error;
    }
};