const MOCK_TRAMITES = [
  {
    idFolio: 'IRL-2026-000154',
    municipio: 'San Pedro Garza García',
    contribuyente: 'María Fernanda López Ruiz',
    impuestoOActo: 'Impuesto predial',
    estatusPrimario: { id: 1, nombre: 'EN ANÁLISIS', tipo: 'info' },
    estatusSecundario: { id: 11, nombre: 'SIN REQUERIMIENTO', tipo: 'neutral' },
    ultimaModificacion: { usuario: 'JPérez', fechaHora: '2026-05-28T10:42:00' },
    tipoTramite: 'ASESORIA_SIMPLIFICADA',
  },
  {
    idFolio: 'IRL-2026-000155',
    municipio: 'Monterrey',
    contribuyente: 'Comercializadora del Norte S.A. de C.V.',
    impuestoOActo: 'Multa',
    estatusPrimario: { id: 2, nombre: 'PENDIENTE', tipo: 'warning' },
    estatusSecundario: { id: 12, nombre: 'CON DOCUMENTOS', tipo: 'success' },
    ultimaModificacion: { usuario: 'AGarcía', fechaHora: '2026-05-27T16:18:00' },
    tipoTramite: 'QUEJAS_RECLAMACIONES',
  },
  {
    idFolio: 'IRL-2026-000156',
    municipio: 'Guadalupe',
    contribuyente: 'Juan Carlos Méndez Soto',
    impuestoOActo: 'Acto administrativo',
    estatusPrimario: { id: 3, nombre: 'CONCLUIDO', tipo: 'success' },
    estatusSecundario: { id: 13, nombre: 'ARCHIVADO', tipo: 'neutral' },
    ultimaModificacion: { usuario: 'LRamírez', fechaHora: '2026-05-26T09:05:00' },
    tipoTramite: 'REPRESENTACION_LEGAL_IRL',
  },
];

function normalizeText(val) {
  return String(val ?? '').toLowerCase().trim();
}

export async function listarTramitesBandeja({ tipoTramite, query, estatusId } = {}) {
  const q = normalizeText(query);
  const estatus = estatusId === '' || estatusId === null || estatusId === undefined ? null : Number(estatusId);

  const items = MOCK_TRAMITES.filter((t) => {
    if (tipoTramite && t.tipoTramite !== tipoTramite) return false;
    if (estatus !== null) {
      const a = Number(t.estatusPrimario?.id);
      const b = Number(t.estatusSecundario?.id);
      if (a !== estatus && b !== estatus) return false;
    }
    if (!q) return true;
    const folio = normalizeText(t.idFolio);
    const contrib = normalizeText(t.contribuyente);
    return folio.includes(q) || contrib.includes(q);
  });

  await new Promise((r) => setTimeout(r, 250));
  return { items };
}

export default { listarTramitesBandeja };
