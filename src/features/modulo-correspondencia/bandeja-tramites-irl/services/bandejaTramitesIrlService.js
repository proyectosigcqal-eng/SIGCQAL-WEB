// features/modulo-correspondencia/bandeja-tramites-irl/services/bandejaTramitesIrlService.js

const API_BASE = import.meta.env.VITE_API_URL ?? 'http://localhost:8081/SIGCQAL_dev';

// Adapta el JSON del backend al shape que usa BandejaTramitesIrlPage
const adaptarItem = (item) => ({
  idFolio:        item.folio ?? '',
  municipio:      item.municipio_procedencia ?? '',
  contribuyente:  item.contribuyente ?? '',
  impuestoOActo:  item.tipo_acto ?? '',
  estatusPrimario: {
    id:     item.estatus_principal ?? '',
    nombre: item.estatus_principal ?? '',
    tipo:   resolverTipoEstatus(item.estatus_principal),
  },
  estatusSecundario: {
    id:     item.estatus_secundario ?? '',
    nombre: item.estatus_secundario ?? '',
    tipo:   resolverTipoEstatus(item.estatus_secundario),
  },
  ultimaModificacion: {
    usuario:  item.ultima_modificacion?.descripcion ?? '',
    fechaHora: item.ultima_modificacion?.timestamp ?? '',
  },
  tipoTramite: item.tipo_tramite ?? '',
});

// Mapea el estatus a un color para los badges
const resolverTipoEstatus = (estatus) => {
  if (!estatus) return 'neutral';
  const t = estatus.toUpperCase();
  if (t.includes('CONCLUIDO') || t.includes('APROBADO') || t.includes('RESUELTO'))
    return 'success';
  if (t.includes('PENDIENTE') || t.includes('REVISION') || t.includes('PREVENCI'))
    return 'warning';
  if (t.includes('VENCIDO') || t.includes('NO PRESENTADA') || t.includes('BLOQUEADO'))
    return 'danger';
  if (t.includes('ANALISIS') || t.includes('PROCESO') || t.includes('ASIGNADO'))
    return 'info';
  return 'neutral';
};

export async function listarTramitesBandeja({
  tipoTramite,
  query,
  estatusId,
  signal,
} = {}) {
  const params = new URLSearchParams();

  if (query && query.trim())    params.append('search',       query.trim());
  if (estatusId)                params.append('estatus',      estatusId);
  if (tipoTramite)              params.append('tipo_tramite', tipoTramite);

  const url = `${API_BASE}/api/v1/tramites/bandeja?${params.toString()}`;

  const res = await fetch(url, { signal });

  if (!res.ok) {
    throw new Error(`Error ${res.status}: no se pudo cargar la bandeja`);
  }

  const data = await res.json();

  if (!Array.isArray(data)) {
    throw new Error('Respuesta inesperada del servidor');
  }

  return { items: data.map(adaptarItem) };
}

export default { listarTramitesBandeja };