import axios from 'axios';

const API = 'http://localhost:8081/SIGCQAL_dev/api/v1';

export const obtenerAcuseOficioPorId = async (id) => {
  // Obtener el registro de acuse de oficio (contiene metadata y referencia al oficio)
  const res = await axios.get(`${API}/acuse-oficio/${id}`);
  return res.data;
};