
import axios from 'axios'; 

const API_URL = 'http://localhost:8081/SIGCQAL_dev/api/v1/correspondencia/bitacora';

export const obtenerBitacoraPorCorrespondencia = async (idCorrespondencia) => {
  try {
    const response = await axios.get(`${API_URL}/${idCorrespondencia}`);
    return response.data;
  } catch (error) {
    console.error("Error al obtener la bitácora histórica", error);
    throw error;
  }
};