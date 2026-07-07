import axios from 'axios';

const API = 'http://localhost:8081/SIGCQAL_Prod/api/v1';

export const obtenerAcusePorId = async (id) => {
  const res = await axios.get(`${API}/acuse-interno/${id}`);
  return res.data;
};

// Guarda el seguimiento (texto)
// Guarda el seguimiento (texto) — usa FormData porque el controller
// tiene consumes = MULTIPART_FORM_DATA_VALUE con @ModelAttribute
export const guardarSeguimientoMemorandum = async (payload) => {
  const fd = new FormData();
  fd.append('idMemo',                         payload.idMemo);
  fd.append('respuestaSeguimientoMemorandum', payload.respuestaSeguimientoMemorandum);
  fd.append('fechaResolucion',                payload.fechaResolucion);
  fd.append('horaResolucion',                 payload.horaResolucion);
  if (payload.idUsuario != null) fd.append('idUsuario', String(payload.idUsuario));
  if (payload.idEstatus  != null) fd.append('idEstatus',  String(payload.idEstatus));

  const res = await fetch(`${API}/seguimiento-memorandum/guardar`, {
    method: 'POST',
    body: fd,   // sin Content-Type — el browser pone el boundary automáticamente
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.message || `Error ${res.status}`);
  }
  return res.json();
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