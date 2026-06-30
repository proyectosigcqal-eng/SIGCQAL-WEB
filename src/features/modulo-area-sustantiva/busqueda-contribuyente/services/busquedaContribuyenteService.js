import axios from 'axios';
import { API_HOST } from '@/shared/config/api';
 
const CONTRIBUYENTES_URL = `${API_HOST}/api/v1/contribuyentes`;
 
export const buscarContribuyentes = async (texto) => {
  const response = await axios.get(`${CONTRIBUYENTES_URL}/buscar`, {
    params: { texto }
  });
  return response.data;
};