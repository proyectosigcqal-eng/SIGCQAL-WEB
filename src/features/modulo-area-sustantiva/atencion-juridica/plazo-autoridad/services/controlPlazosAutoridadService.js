import axios from 'axios';
import API_BASE_URL from '@/shared/config/api';

const buildUrl = (expedienteId, path) =>
  `${API_BASE_URL}/expedientes/${expedienteId}/plazo-autoridad${path.startsWith('/') ? '' : '/'}${path}`;

export const controlPlazosAutoridadService = {
  obtenerSemaforo: async (expedienteId) => {
    const res = await axios.get(buildUrl(expedienteId, '/semaforo'));
    return res.data;
  },
  registrarInformeRecibido: async (expedienteId, form, pdfFile) => {
    const data = new FormData();
    const payload = {
      numeroOficioRespuesta: form?.numeroOficioRespuesta ?? '',
      fojas: form?.fojas === '' || form?.fojas === null || form?.fojas === undefined ? null : Number(form.fojas),
      fechaRecepcion: form?.fechaRecepcion ?? null,
    };

    data.append('request', new Blob([JSON.stringify(payload)], { type: 'application/json' }));
    if (pdfFile) data.append('pdf', pdfFile);

    const res = await axios.post(buildUrl(expedienteId, '/registrar-informe'), data, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return res.data;
  },
};

