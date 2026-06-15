import API_BASE_URL from '@/shared/config/api';

const buildUrl = (expedienteId, path = '') =>
  `${API_BASE_URL}/expedientes/${expedienteId}/constancia-interna-remision${path}`;

const descargarArchivo = (blob, filename) => {
  const url = window.URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  window.URL.revokeObjectURL(url);
};

/**
 * Genera constancia DOCX y dispara descarga.
 */
export const generarConstancia = async (expedienteId, datos) => {
  if (!expedienteId) {
    throw new Error('expedienteId es requerido');
  }

  if (!datos?.documentacionRemite?.trim()) {
    throw new Error('Documentación que se remite es requerida');
  }

  if (!datos?.motivosRemite?.trim()) {
    throw new Error('Motivos por los que se remite es requerido');
  }

  const response = await fetch(buildUrl(expedienteId, '/generate'), {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      documentacionRemite: datos.documentacionRemite.trim(),
      motivosRemite: datos.motivosRemite.trim(),
      observaciones: datos.observaciones?.trim() || '',
    }),
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Error ${response.status}: ${errorText || 'Error al generar constancia'}`);
  }

  const blob = await response.blob();
  descargarArchivo(blob, `constancia-${expedienteId}-${Date.now()}.docx`);

  return { success: true, message: 'Constancia generada y descargada' };
};

/**
 * Obtener preview de constancia existente.
 */
export const obtenerPreviewConstancia = async (folio) => {
  const response = await fetch(`${API_BASE_URL}/expedientes/${folio}/constancia-preview`);

  if (!response.ok) {
    throw new Error(`HTTP ${response.status}`);
  }

  return response.json();
};
