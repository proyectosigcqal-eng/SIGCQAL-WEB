// features/modulo-area-sustantiva/representacion-legal-irl/services/bandejaIrlService.js

const API_BASE = import.meta.env.VITE_API_URL ?? 'http://localhost:8081/SIGCQAL_dev';
import { pickFecha, normalizeDateValue } from '@/shared/utils/dateUtils';

// ─── Helpers ────────────────────────────────────────────────────────────────

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

const obtenerValor = (item, campos) => {
  if (!item || typeof item !== 'object') return undefined;
  for (const campo of campos) {
    if (item[campo] !== undefined && item[campo] !== null && item[campo] !== '') {
      return item[campo];
    }
  }
  return undefined;
};

// ── Mapea campos del DTO (camelCase de Spring Boot) al modelo del frontend ──
// Se toleran variaciones del DTO sin romper la UI y se preservan ids estables para React.
const adaptarItem = (item) => {
  const idRepresentacionLegal = obtenerValor(item, [
    'idRepresentacionLegal',
    'idRepresentacion',
    'id_representacion_legal',
    'id_representacion',
    'id',
  ]);

  const idExpediente = obtenerValor(item, [
    'idExpediente',
    'id_expediente',
    'idExpedienteOriginal',
    'id_expediente_original',
  ]);

  const idDemandaAmparo = obtenerValor(item, [
    'idDemandaAmparo',
    'id_demanda_amparo',
    'idDemanda',
    'id_demanda',
  ]);
  const demandaId = idDemandaAmparo;

  // ← NUEVO: sin esto TablaIrl.jsx nunca ve idRlCir/idQuejaRlCir y el botón
  // DESCARGAR CIR / DESCARGAR CIR QUEJA no aparece aunque el backend lo mande.
  const idRlCir = obtenerValor(item, [
    'idRlCir',
    'id_rl_cir',
  ]);

  const idQuejaRlCir = obtenerValor(item, [
    'idQuejaRlCir',
    'id_queja_rl_cir',
  ]);

  const folio = obtenerValor(item, [
    'folio',
    'folioGobierno',
    'folio_gobierno',
    'folioExpediente',
    'folio_expediente',
  ]);

  const contribuyente = obtenerValor(item, [
    'contribuyente',
    'nombreContribuyente',
    'nombre_contribuyente',
    'nombre',
  ]);

  const municipio = obtenerValor(item, [
    'municipioProcedencia',
    'municipio_procedencia',
    'municipio',
  ]);

  const estatus = obtenerValor(item, [
    'estatus',
    'estatusPrincipal',
    'estatus_principal',
    'estado',
  ]);

  const esEvolucion = obtenerValor(item, ['esEvolucion', 'es_evolucion']);

  return {
    // Identificadores
    id: idRepresentacionLegal ?? idExpediente ?? folio ?? null,
    idRepresentacionLegal,
    idDemandaAmparo: demandaId,
    idExpediente,
    idRlCir,
    idQuejaRlCir,
    folio: folio ?? '',
    folioGobierno: folio ?? '',

    // Datos del expediente
    contribuyente: contribuyente ?? '',
    municipio: municipio ?? '',
    estatus: estatus ?? '',
    esEvolucion:
      typeof esEvolucion === 'boolean'
        ? esEvolucion
        : typeof item?.esEvolucion === 'boolean'
          ? item.esEvolucion
          : item?.estatusSecundario === 'Evolución' || item?.estatus_secundario === 'Evolución',
    fechaCreacion: obtenerValor(item, ['fechaCreacion', 'fecha_creacion', 'ultimaModificacion', 'ultima_modificacion']) ?? null,
    fechaRegistro: normalizeDateValue(obtenerValor(item, ['fechaRegistro', 'fecha_registro', 'fechaCreacion', 'fecha_creacion'])) ?? null,
    bloqueado: item?.bloqueado ?? false,
    asesor: obtenerValor(item, ['asesor', 'nombreAsesor', 'nombre_asesor', 'nombreCompleto']) ?? '',
    idEstatus: obtenerValor(item, ['idEstatus', 'id_estatus']) ?? null,
    diasRestantes: normalizarDiasRestantes(obtenerValor(item, ['diasRestantes', 'dias_restantes'])),

    // Flags de hitos (todos deben venir del DTO)
    tieneCir: item?.tieneCir ?? item?.tiene_cir ?? false,
    tieneDemanda: item?.tieneDemanda ?? item?.tiene_demanda ?? false,
    tieneOficio: item?.tieneOficio ?? item?.tiene_oficio ?? false,
    tieneAudiencia: item?.tieneAudiencia ?? item?.tiene_audiencia ?? false,
    tieneSentencia: item?.tieneSentencia ?? item?.tiene_sentencia ?? false,
    tieneEjecutoria: item?.tieneEjecutoria ?? item?.tiene_ejecutoria ?? false,
    tieneCumplimiento: item?.tieneCumplimiento ?? item?.tiene_cumplimiento ?? false,

    // Fechas de hitos
    fechaCir: obtenerValor(item, ['fechaCir', 'fecha_cir']) ?? null,
    fechaDemanda: obtenerValor(item, ['fechaDemanda', 'fecha_demanda']) ?? null,
    fechaOficio: obtenerValor(item, ['fechaOficio', 'fecha_oficio']) ?? null,
    fechaAudiencia: obtenerValor(item, ['fechaAudiencia', 'fecha_audiencia']) ?? null,
    fechaSentencia: obtenerValor(item, ['fechaSentencia', 'fecha_sentencia']) ?? null,
    fechaEjecutoria: obtenerValor(item, ['fechaEjecutoria', 'fecha_ejecutoria']) ?? null,
  };
};

// ─── Bandeja IRL ────────────────────────────────────────────────────────────

export async function listarBandejaIrl({
  esEvolucion,
  idEstatus,
  idAsesor,
  query,
  signal,
} = {}) {
  const params = new URLSearchParams();

  if (esEvolucion !== undefined && esEvolucion !== null)
    params.append("es_evolucion", String(esEvolucion));

  // ✅ BUG 2 CORREGIDO: el backend espera "estatus", no "id_estatus"
  if (idEstatus !== undefined && idEstatus !== null)
    params.append("estatus", String(idEstatus));

  if (idAsesor !== undefined && idAsesor !== null)
    params.append("id_asesor", String(idAsesor));

  if (query?.trim())
    params.append("search", query.trim());

  const url = `${API_BASE}/api/v1/tramites/bandeja-representacion-legal?${params.toString()}`;
  const res = await fetch(url, { signal });

  if (!res.ok)
    throw new Error(`Error ${res.status}: no se pudo cargar la bandeja IRL`);

  const data  = await res.json();
  const items = extraerItems(data);

  if (!items) throw new Error("Respuesta inesperada del servidor");

  // ✅ BUG 1 CORREGIDO: retorna el array directamente, no { items: [...] }
  // El hook espera Array.isArray(data) === true
  return items.map(adaptarItem);
}

// ─── Catálogo de estatus ─────────────────────────────────────────────────────

export async function listarEstatusRepresentacionLegal() {
  const url = `${API_BASE}/catalogos/estatus-representacion-legal`;
  const res = await fetch(url);

  if (!res.ok)
    throw new Error(`Error ${res.status}: no se pudo cargar el catálogo de estatus`);

  const data = await res.json();

  if (!Array.isArray(data))
    throw new Error("Respuesta inesperada del servidor en catálogo estatus");

  return data.map((item) => ({
    id:    item.id,
    label: item.nombre,
  }));
}

export default { listarBandejaIrl, listarEstatusRepresentacionLegal };