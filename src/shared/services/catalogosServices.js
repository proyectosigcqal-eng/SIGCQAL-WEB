import axios from 'axios';


const API_BASE_URL = 'http://localhost:8081/SIGCQAL_dev/catalogos';

export const getAreas = async () => {
        const response = await axios.get(`${API_BASE_URL}/areas`);
        return response.data;
};

export const getUsuarios = async () => { 
        const response = await axios.get(`${API_BASE_URL}/usuarios`);
        return response.data;

};

export const getPlantillas = async () => {
        const response = await axios.get(`${API_BASE_URL}/plantillas/listar`);
        return response.data;

};

export const getEstatus = async () => {
 
        const response = await axios.get(`${API_BASE_URL}/estatus`);
        return response.data;

};

export const getRoles = async () => {

        const response = await axios.get(`${API_BASE_URL}/roles`);
        return response.data;

};
