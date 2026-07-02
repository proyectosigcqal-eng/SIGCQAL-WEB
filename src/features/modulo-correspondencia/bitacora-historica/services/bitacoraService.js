
import axios from 'axios'; 

const API_URL = 'http://localhost:8081/SIGCQAL_dev/api/v1/correspondencia/bitacora';

export const obtenerBitacoraPorCorrespondencia = async (idCorrespondencia) => {
  try {
    const response = await axios.get(`${API_URL}/${idCorrespondencia}`);
    const data = response.data;
    if (Array.isArray(data)) {
      return data.sort((a, b) => {
        const da = a.fechaMovimiento ? new Date(a.fechaMovimiento) : new Date(0);
        const db = b.fechaMovimiento ? new Date(b.fechaMovimiento) : new Date(0);
        return da - db;
      });
    }
    return data;
  } catch (error) {
    console.error("Error al obtener la bitácora histórica", error);
    throw error;
  }
};

export const crearRegistro = async (dto) => {
  try {
    const response = await axios.post(API_URL, dto);
    return response.data;
  } catch (error) {
    console.error('Error al crear registro de bitácora', error.response?.data || error.message);
    throw error;
  }
};