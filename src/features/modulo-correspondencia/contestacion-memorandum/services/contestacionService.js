import axios from 'axios';

const API = 'http://localhost:8081/SIGCQAL_dev/api/v1';

export const obtenerAcusePorId = async (id) => {
  const res = await axios.get(`${API}/acuse-interno/${id}`);
  return res.data;
};

// Guarda el seguimiento (texto)
export const guardarSeguimientoMemorandum = async (payload) => {
  const res = await axios.post(`${API}/seguimiento-memorandum/guardar`, payload);
  return res.data;
};

// Sube el PDF firmado — reutiliza tu lógica de finalizarAsignacion
export const subirPdfFirmado = async (idSeguimiento, archivo) => {
  const formData = new FormData();
  formData.append('archivo', archivo);

  const response = await fetch(`${API}/seguimiento-memorandum/${idSeguimiento}/adjunto`, {
    method: 'POST',
    body: formData,
  });

  if (!response.ok) throw new Error('Error al subir el documento firmado');
  return true;
};

export const obtenerProximoFolio = async () => {
  const res = await axios.get(`${API}/seguimiento-memorandum/listar`);
  const total = res.data.length;
  const proximo = total + 1;
  const anio = new Date().getFullYear();
  return `CM-${String(proximo).padStart(6, '0')}-${anio}`;
};