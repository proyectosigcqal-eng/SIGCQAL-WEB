const API = import.meta.env.VITE_API_URL ?? 'http://localhost:8081/SIGCQAL_dev';
const BASE_URL = `${API}/api/modulo-area-sustantiva/resolucion-final`;

/**
 * Crea el registro de resolucion_final.
 * @param {Object} payload - { fechaEmisionResolucion, conceptoCobro, contactoVia,
 *   numeroCredito, folioCredito, idExpediente, idAri, idQuejaRespuestaAutoridad,
 *   idEstatusQueja, idEstatusExpediente }
 * @returns {Promise<Object>} ResolucionFinalResponseDTO (incluye idResolucionFinal)
 */
export const crearResolucionFinal = async (payload) => {
  const response = await fetch(BASE_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    const errorBody = await response.json().catch(() => null);
    throw new Error(errorBody?.message ?? 'Error al crear la resolución final');
  }

  return response.json();
};

/**
 * Busca una resolución final existente por id_expediente, para evitar
 * crear duplicados si el usuario regresa a esta pantalla.
 * @param {number} idExpediente
 * @returns {Promise<Object|null>} la primera resolución encontrada o null
 */
export const buscarResolucionPorExpediente = async (idExpediente) => {
  const response = await fetch(`${BASE_URL}/expediente/${idExpediente}`);
  if (!response.ok) return null;

  const lista = await response.json();
  return Array.isArray(lista) && lista.length > 0 ? lista[0] : null;
};

/**
 * Genera el Acuerdo de Cierre (.docx) para una resolución ya guardada.
 * @param {number} idResolucionFinal
 * @param {Object} datosOficio - campos del formulario (folio, expedienteNum,
 *   autoridadFiscal, fechaSolicitud, nombreContribuyente, motivoQueja,
 *   oficioNumero, fechaOficio, fechaIngresoOficio, numeroCreditoMulta,
 *   contactoVia, iniciales)
 * @returns {Promise<Object>} ResolucionFinalResponseDTO actualizado (incluye rutaResolucionFinal)
 */
export const generarOficioResolucionFinal = async (idResolucionFinal, datosOficio) => {
  const params = new URLSearchParams(
    Object.fromEntries(
      Object.entries(datosOficio).filter(([, v]) => v !== undefined && v !== null)
    )
  );

  const response = await fetch(
    `${BASE_URL}/${idResolucionFinal}/generar-oficio?${params.toString()}`,
    { method: 'POST' }
  );

  if (!response.ok) {
    const errorBody = await response.json().catch(() => null);
    throw new Error(errorBody?.message ?? 'Error al generar el Acuerdo de Cierre');
  }

  return response.json();
};