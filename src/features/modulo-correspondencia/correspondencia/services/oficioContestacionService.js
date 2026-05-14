import axios from 'axios';

const API = 'http://localhost:8081/SIGCQAL_dev/api/v1/oficio-contestacion-externa';

export const guardarOficioContestacion = async (dto) => {
  const response = await axios.post(API, dto);
  return response.data;
};

export const buscarOficioPorCorrespondencia = async (idCorrespondencia) => {
  try {
    const response = await axios.get(`${API}/correspondencia/${idCorrespondencia}`);
    return response.data || null;
  } catch (err) {
    if (err?.response?.status === 404) return null;
    console.error('Error verificando oficio:', err?.message || err);
    return null;
  }
};
