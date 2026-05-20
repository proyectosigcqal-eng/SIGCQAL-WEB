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
