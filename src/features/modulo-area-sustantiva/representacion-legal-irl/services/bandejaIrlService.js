// features/modulo-area-sustantiva/representacion-legal-irl/services/bandejaIrlService.js

const API_BASE =
  import.meta.env.VITE_API_URL ?? "http://localhost:8081/SIGCQAL_dev";

const adaptarItem = (item) => ({
  id: item.id ?? null,
  folioGobierno: item.folioGobierno ?? "",
  contribuyente: item.contribuyente ?? "",
  asesor: item.asesor ?? "",
  municipio: item.municipio ?? "",
  estatus: item.estatus ?? "",
  fechaCreacion: item.fechaCreacion ?? "",
  esEvolucion: item.esEvolucion ?? false,
  idEstatus: item.idEstatus ?? null,
});

export async function listarBandejaIrl({
  esEvolucion,
  idEstatus,
  query,
  signal,
} = {}) {
  const params = new URLSearchParams();

  if (esEvolucion !== undefined && esEvolucion !== null) {
    params.append("es_evolucion", String(esEvolucion));
  }
  if (idEstatus !== undefined && idEstatus !== null) {
    params.append("id_estatus", String(idEstatus));
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
