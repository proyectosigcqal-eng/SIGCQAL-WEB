import axios from 'axios';

const API_SEGUIMIENTO_URL = 'http://localhost:8081/SIGCQAL_dev/api/v1/seguimiento-correspondencia';
const API_CORRESPONDENCIA_URL = 'http://localhost:8081/SIGCQAL_dev/api/v1/correspondencias/entrada';

export const obtenerCorrespondenciaPorId = async (id) => {
  const response = await axios.get(`${API_CORRESPONDENCIA_URL}/${id}`);
  return response.data;
};

export const guardarSeguimiento = async (payload) => {
  const formData = new FormData();

  // Usamos exactamente los mismos nombres que tu SeguimientoCorrespondenciaRequestDTO.java
  formData.append('idCorrespondencia', payload.id_correspondencia);
  formData.append('folioRespuesta', payload.folio_respuesta);
  formData.append('respuestaSeguimientoCorrespondencia', payload.respuesta_seguimiento_correspondencia);
  formData.append('fechaResolucion', payload.fecha_resolucion);
  formData.append('horaResolucion', payload.hora_resolucion);
  formData.append('idUsuario', payload.id_usuario || 2); // Valor por defecto si no viene
  formData.append('idEstatus', payload.id_estatus || 4);

  // IMPORTANTE: payload.archivo_adjunto debe ser el objeto File del input
  if (payload.archivo_adjunto) {
    formData.append('archivoAdjunto', payload.archivo_adjunto);
  }

  // Usamos fetch sin definir Headers manuales para que el navegador 
  // genere el boundary correcto de multipart/form-data automáticamente
  const response = await fetch(`${API_SEGUIMIENTO_URL}/guardar`, {
    method: 'POST',
    body: formData,
  });

  if (!response.ok) {
    const errorBody = await response.text();
    let errorMessage = 'Error al guardar el seguimiento';
    
    try {
      const errorData = JSON.parse(errorBody);
      errorMessage = errorData.message || errorMessage;
    } catch {
      errorMessage = errorBody || errorMessage;
    }
    
    throw new Error(errorMessage);
  }

  return response.json();
};