// features/modulo-area-sustantiva/representacion-legal-irl/services/bandejaIrlService.js

const API_BASE =
  import.meta.env.VITE_API_URL ?? "http://localhost:8081/SIGCQAL_dev";

/**
 * Adapta el JSON del backend al shape que usa TablaIrl.
 *
 * El backend (GET /api/v1/representacion-legal/bandeja) devuelve un
 * arreglo de objetos con campos snake_case; el adapter los convierte a camelCase.
 *
 * Para IRL Directo el backend hace JOIN directo con expedientes.
 * Para IRL Evolución el backend recorre:
 *   representacion_legal → resolucion_final → acci → ari → cir → queja → expediente
 */
const adaptarItem = (item) => ({
  id: item.id ?? null,
  folioGobierno: item.folioGobierno ?? "",
  contribuyente: item.contribuyente ?? "",
  asesor: item.asesor ?? "",
  municipio: item.municipio ?? "",
  estatus: item.estatus ?? "",
  fechaCreacion: item.fechaCreacion ?? "",
  esEvolucion: item.es_evolucion ?? false,
});

/**
 * Lista trámites de Representación Legal IRL.
 *
 * @param {Object}      opts
 * @param {boolean}     [opts.esEvolucion]  false = Directo, true = Evolución
 * @param {string}      [opts.query]        Búsqueda por folio o contribuyente
 * @param {AbortSignal} [opts.signal]       Para cancelar el request
 * @returns {Promise<{ items: Array }>}
 */
export async function listarBandejaIrl({ esEvolucion, query, signal } = {}) {
  const params = new URLSearchParams();

  if (esEvolucion !== undefined && esEvolucion !== null) {
    params.append("es_evolucion", String(esEvolucion));
  }
  if (query?.trim()) params.append("search", query.trim());

  const url = `${API_BASE}/api/v1/representacion-legal/bandeja?${params.toString()}`;

  const res = await fetch(url, { signal });

  if (!res.ok) {
    throw new Error(`Error ${res.status}: no se pudo cargar la bandeja IRL`);
  }

  const data = await res.json();

  if (!Array.isArray(data)) {
    throw new Error("Respuesta inesperada del servidor");
  }

  return { items: data.map(adaptarItem) };
}

export default { listarBandejaIrl };
