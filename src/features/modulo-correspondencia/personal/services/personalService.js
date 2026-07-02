import axios from 'axios';

const API_URL = 'http://localhost:8081/SIGCQAL_Prod/api/personal';

export const getPersonal = () => axios.get(API_URL);
export const createPersonal = (data) => axios.post(API_URL, data);
export const updatePersonal = (id, data) => axios.put(`${API_URL}/${id}`, data);
export const deletePersonal = (id) => axios.delete(`${API_URL}/${id}`);
export const getMunicipios= () => axios.get("http://localhost:8081/SIGCQAL_Prod/catalogos/municipios");
export const getEstados = () => axios.get("http://localhost:8081/SIGCQAL_Prod/catalogos/estados");
export const getTiposPersona = () => axios.get("http://localhost:8081/SIGCQAL_Prod/catalogos/tipos-personas");
export const getPersonalById = (id) => axios.get(`${API_URL}/${id}`);
