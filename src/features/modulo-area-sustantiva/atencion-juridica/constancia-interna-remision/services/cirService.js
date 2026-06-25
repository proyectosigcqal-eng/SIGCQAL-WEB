import axios from 'axios';
import { API_BASE_URL } from '@/shared/config/api';

const API_EXPEDIENTES = `${API_BASE_URL}/expedientes`;

const cirService = {
  obtenerPrecargados: async (expedienteId) => {
    try {
      const response = await axios.get(
        `${API_EXPEDIENTES}/${expedienteId}/detalle-asesoria`
      );

      return {
        asesorQueRemite: response.data.asesorQueRemite || 'No disponible',
        nombreEncargado: response.data.nombreEncargado || 'No disponible',
      };
    } catch (error) {
      console.warn('Error al cargar precargados:', error);
      return {
        asesorQueRemite: 'No disponible',
        nombreEncargado: 'No disponible',
      };
    }
  },

  previewCIR: async (payload) => {
    try {
      const request = {
        documentacionRemite: payload.fundamentos,
        motivosRemite: payload.fundamentos,
        observaciones: payload.observaciones?.trim() || '',
        asesorQueRemite: payload.asesorQueRemite,
        nombreEncargado: payload.nombreEncargado,
        fechaCIR: payload.fechaCIR,
      };

      const response = await axios.post(
        `${API_EXPEDIENTES}/${payload.expedienteId}/constancia-interna-remision/preview`,
        request,
        { responseType: 'text' }
      );

      const blob = new Blob([response.data], { type: 'text/html;charset=utf-8' });
      return window.URL.createObjectURL(blob);
    } catch (error) {
      throw new Error(
        error.response?.data?.message || 'Error al generar preview'
      );
    }
  },

  generarCIR: async (payload) => {
    try {
      const request = {
        documentacionRemite: payload.fundamentos,
        motivosRemite: payload.fundamentos,
        observaciones: payload.observaciones?.trim() || '',
      };

      const response = await axios.post(
        `${API_EXPEDIENTES}/${payload.expedienteId}/constancia-interna-remision/generate`,
        request,
        { responseType: 'blob' }
      );

      const timestamp = new Date().getTime();
      const filename = `CIR_${payload.expedienteId}_${timestamp}.docx`;
      const blob = new Blob([response.data], {
        type: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', filename);
      document.body.appendChild(link);
      link.click();
      link.parentNode.removeChild(link);
      window.URL.revokeObjectURL(url);

      return { success: true, filename };
    } catch (error) {
      throw new Error(
        error.response?.data?.message || 'Error al generar CIR'
      );
    }
  },

  descargarCIR: async (expedienteId, filename) => {
    try {
      const response = await axios.get(
        `${API_EXPEDIENTES}/${expedienteId}/constancia-interna-remision/download/${filename}`,
        { responseType: 'blob' }
      );

      const blob = new Blob([response.data], {
        type: response.headers['content-type'] ||
          'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', filename);
      document.body.appendChild(link);
      link.click();
      link.parentNode.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (error) {
      throw new Error('Error al descargar CIR');
    }
  },
};

export default cirService;
