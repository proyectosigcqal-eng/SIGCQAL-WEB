// features/modulo-area-sustantiva/representacion-legal-irl/services/bandejaIrlService.js

const API_BASE =
  import.meta.env.VITE_API_URL ?? "http://localhost:8081/SIGCQAL_dev";


const normalizarDiasRestantes = (value) => {
  if (value === null || value === undefined || value === "") return null;

  const parsed = Number(value);
  if (!Number.isFinite(parsed)) return null;

  return parsed > 0 ? parsed : 0;
};

const extraerItems = (data) => {
  if (Array.isArray(data)) return data;
  if (Array.isArray(data?.content)) return data.content;
  return null;
};


const adaptarItem = (item) => ({
  idRepresentacionLegal: item.idRepresentacionLegal ?? item.id ?? null,
  id: item.id ?? item.idRepresentacionLegal ?? null,
  folioGobierno: item.folioGobierno ?? "",
  contribuyente: item.contribuyente ?? "",
  asesor: item.asesor ?? "",
  municipio: item.municipio ?? "",
  estatus: item.estatus ?? "",
  fechaCreacion: item.fechaCreacion ?? "",
  esEvolucion: item.esEvolucion ?? false,
  idEstatus: item.idEstatus ?? null,
  diasRestantes: normalizarDiasRestantes(item.diasRestantes),

});

export async function listarBandejaIrl({
  esEvolucion,
  idEstatus,
  idAsesor,

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

  if (idAsesor !== undefined && idAsesor !== null) {
    params.append("id_asesor", String(idAsesor));
  }

  if (query?.trim()) params.append("search", query.trim());

  const url = `${API_BASE}/api/v1/representacion-legal/bandeja?${params.toString()}`;
  const res = await fetch(url, { signal });

  if (!res.ok) {
    throw new Error(`Error ${res.status}: no se pudo cargar la bandeja IRL`);
  }

  const data = await res.json();
  const items = extraerItems(data);

  if (!items) {
    throw new Error("Respuesta inesperada del servidor");
  }

  return { items: items.map(adaptarItem) };
}

// ─── NUEVO: Catálogo de estatus dinámico ───
export async function listarEstatusRepresentacionLegal() {
  const url = `${API_BASE}/catalogos/estatus-representacion-legal`; // ← SIN /api/v1
  const res = await fetch(url);

  if (!res.ok) {
    throw new Error(
      `Error ${res.status}: no se pudo cargar el catálogo de estatus`,
    );
  }

  const data = await res.json();

  if (!Array.isArray(data)) {
    throw new Error("Respuesta inesperada del servidor en catálogo estatus");
  }

  return data.map((item) => ({
    id: item.id,
    label: item.nombre,
  }));
}

export default { listarBandejaIrl, listarEstatusRepresentacionLegal };
