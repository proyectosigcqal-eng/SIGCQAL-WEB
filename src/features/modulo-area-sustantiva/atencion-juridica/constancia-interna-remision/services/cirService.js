import axios from 'axios';

const API_BASE = import.meta.env.VITE_API_BASE || 'http://localhost:8081/SIGCQAL_dev';

const cirService = {
  // GET preview PDF (inline)
  getPreview: async (expedienteId, formData) => {
    const params = new URLSearchParams();
    if (formData.analisisJuridico)
      params.append('analisisJuridico', formData.analisisJuridico);
    if (formData.determinacion)
      params.append('determinacion', formData.determinacion);
    if (formData.autoridadContesto !== null)
      params.append('autoridadContesto', formData.autoridadContesto);
    if (formData.informeAutoridadFecha)
      params.append('informeAutoridadFecha', formData.informeAutoridadFecha);
    if (formData.informeAutoridadAsunto)
      params.append('informeAutoridadAsunto', formData.informeAutoridadAsunto);
    if (formData.informeAutoridadTexto)
      params.append('informeAutoridadTexto', formData.informeAutoridadTexto);

    return await axios.get(
      `${API_BASE}/api/v1/expedientes/${expedienteId}/constancia-interna-remision/preview?${params.toString()}`,
      { responseType: 'blob' }
    );
  },

  // POST generar y guardar CIR
  generarCIR: async (expedienteId, formData) => {
    return await axios.post(
      `${API_BASE}/api/v1/expedientes/${expedienteId}/constancia-interna-remision/generate-pdf`,
      formData
    );
  },

  // GET descargar CIR generado
  descargarCIR: async (expedienteId, filename) => {
    return await axios.get(
      `${API_BASE}/api/v1/expedientes/${expedienteId}/constancia-interna-remision/download/${filename}`,
      { responseType: 'blob' }
    );
  },
};

export default cirService;
