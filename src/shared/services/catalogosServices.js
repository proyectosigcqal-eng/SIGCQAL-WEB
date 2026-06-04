import axios from 'axios';
import API_BASE_URL from '@/shared/config/api';

// The legacy catalogos endpoint lives at /SIGCQAL_dev/catalogos (outside /api/v1)
const CATALOGOS_BASE = API_BASE_URL.replace('/api/v1', '') + '/catalogos';

export const getAreas = async () => {
        const response = await axios.get(`${CATALOGOS_BASE}/areas`);
        return response.data;
};

export const getUsuarios = async () => { 
        const response = await axios.get(`${CATALOGOS_BASE}/usuarios`);
        return response.data;

};

export const getPlantillas = async () => {
        const response = await axios.get(`${CATALOGOS_BASE}/plantillas/listar`);
        return response.data;

};

export const getEstatus = async () => {
 
        const response = await axios.get(`${CATALOGOS_BASE}/estatus`);
        return response.data;

};

export const getRoles = async () => {

        const response = await axios.get(`${CATALOGOS_BASE}/roles`);
        return response.data;

};

export const getTiposCorrespondencia = async () => {
                const response = await axios.get(`${CATALOGOS_BASE}/tipos-correspondencia`);
    return response.data;
};

export const getAutoridadesFiscales = async () => {
        const response = await axios.get(`${CATALOGOS_BASE}/autoridades`);
        return response.data;
};

export const getTiposActo = async () => {
        const response = await axios.get(`${CATALOGOS_BASE}/tipo-acto-emitido`);
        return response.data;
};

export const getCalificacionesActo = async () => {
        const response = await axios.get(`${CATALOGOS_BASE}/calificaciones-acto`);
        return response.data;
};

export const getTiposAsesoria = async () => {
        const response = await axios.get(`${CATALOGOS_BASE}/tipos-asesoria`);
        return response.data;
};
export const getPersonas = async () => {
    const response = await axios.get(`${CATALOGOS_BASE}/personas`);
    return response.data;
};

export const getDirecciones = async () => {
    const response = await axios.get(`${CATALOGOS_BASE}/direcciones`);
    return response.data;
};

export const getEmpleados = async () => {
    const response = await axios.get(`${CATALOGOS_BASE}/empleados`);
    return response.data;
};

export const getAutoridades = async () => {
    const response = await axios.get(`${CATALOGOS_BASE}/autoridades`);
    return response.data;
};

export const getCatAutoridades = async () => {
    const response = await axios.get(`${CATALOGOS_BASE}/cat-autoridades`);
    return response.data;
};

export const getCatEstatusSustantiva = async () => {
    const response = await axios.get(`${CATALOGOS_BASE}/cat-estatus-sustantiva`);
    return response.data;
};

export const getCatTipoProceso = async () => {
    const response = await axios.get(`${CATALOGOS_BASE}/cat-tipo-proceso`);
    return response.data;
};

export const getEstatusDetalleExpediente = async () => {
    const response = await axios.get(`${CATALOGOS_BASE}/estatus-detalle-expediente`);
    return response.data;
};

export const getEstatusExpediente = async () => {
    const response = await axios.get(`${CATALOGOS_BASE}/estatus-expediente`);
    return response.data;
};

export const getTipoActoEmitido = async () => {
    const response = await axios.get(`${CATALOGOS_BASE}/tipo-acto-emitido`);
    return response.data;
};

export const getTipoEntrada = async () => {
    const response = await axios.get(`${CATALOGOS_BASE}/tipo-entrada`);
    return response.data;
};

export const getTipoTramite = async () => {
    const response = await axios.get(`${CATALOGOS_BASE}/tipo-tramite`);
    return response.data;
};

export const getControlFoliosConfig = async () => {
    const response = await axios.get(`${CATALOGOS_BASE}/control-folios-config`);
    return response.data;
};

export const getAsesores = async () => {
    const response = await axios.get(`${CATALOGOS_BASE}/asesores`);
    return response.data;
};

export const getMunicipios = async () => {
    const response = await axios.get(`${CATALOGOS_BASE}/municipios`);
    return response.data;
};

export const getEstados = async () => {
    const response = await axios.get(`${CATALOGOS_BASE}/estados`);
    return response.data;
};
