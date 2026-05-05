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