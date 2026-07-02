import axios from 'axios';

const API = 'http://localhost:8081/SIGCQAL_dev/api/v1/archivos';

export const obtenerArchivoCorrespondencia = async (idCorrespondencia) => {
  try {
    const response = await axios.get(`${API}/correspondencia/${idCorrespondencia}/ultimo`);
    return response.data || null;
  } catch (err) {
    if (err?.response?.status === 404) return null;
    console.error('Error obteniendo archivo adjunto:', err?.message || err);
    return null;
  }
};

