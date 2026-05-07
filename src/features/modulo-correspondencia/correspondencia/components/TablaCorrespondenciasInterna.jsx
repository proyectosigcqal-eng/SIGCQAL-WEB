import React, { useEffect, useMemo, useState } from 'react';

const PAGE_SIZE = 10;

const asArray = (value) => (Array.isArray(value) ? value : []);

const normalizeText = (value) =>
  String(value ?? '')
    .trim()
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '');

const safeDateLabel = (value) => {
  if (!value) return '—';
  const d = value instanceof Date ? value : new Date(value);
  if (Number.isNaN(d.getTime())) return String(value);
  try {
    return d.toLocaleDateString('es-MX');
  } catch {
    return d.toISOString().slice(0, 10);
  }
};

const getId = (item) =>
  item?.id ??
  item?.idCorrespondencia ??
  item?.correspondenciaId ??
  item?.id_correspondencia ??
  null;

const getIdEstatus = (item) => item?.idEstatus ?? item?.id_estatus ?? null;

const getEstatusLabel = (item) => {
  const raw = item?.estatus ?? item?.estatusNombre ?? item?.nombreEstatus ?? item?.descripcionEstatus ?? getIdEstatus(item);
  if (raw == null) return 'Sin estatus';
  if (typeof raw === 'number') {
    if (raw === 1) return 'Registrado';
    if (raw === 2) return 'Asignado';
    if (raw === 3) return 'En seguimiento';
    if (raw === 4) return 'Concluido';
    return `Estatus ${raw}`;
  }
  const label = String(raw).trim();
  return label.length ? label : 'Sin estatus';
};

const getEstatusColors = (label) => {
  const n = normalizeText(label);
  if (n.includes('registr')) return { bg: '#DBEAFE', fg: '#1D4ED8' };
  if (n.includes('asign')) return { bg: '#FEF3C7', fg: '#B45309' };
  if (n.includes('seguim')) return { bg: '#DCFCE7', fg: '#166534' };
  if (n.includes('conclu') || n.includes('cerrad') || n.includes('final')) return { bg: '#E5E7EB', fg: '#374151' };
  return { bg: '#E2E8F0', fg: '#0F172A' };
};

const buildEstatusOptions = (items) => {
  const map = new Map();
  asArray(items).forEach((it) => {
    const id = getIdEstatus(it);
    if (id === null || id === undefined || String(id).trim() === '') return;
    const key = String(id);
    if (map.has(key)) return;
    map.set(key, getEstatusLabel(it));
  });
  return Array.from(map.entries()).map(([value, label]) => ({ value, label }));
};

export const TablaCorrespondenciasInterna = ({ correspondencias = [], onGenerarOficio, loading }) => {
  const [texto, setTexto] = useState('');
  const [filtroEstatus, setFiltroEstatus] = useState('');
  const [page, setPage] = useState(1);

  const rows = useMemo(() => asArray(correspondencias), [correspondencias]);
  const estatusOptions = useMemo(() => buildEstatusOptions(rows), [rows]);

  const filtered = useMemo(() => {
    const q = normalizeText(texto);
    const estatus = String(filtroEstatus || '');

    return rows.filter((item) => {
      if (q) {
        const folio = normalizeText(item?.folioUnico ?? item?.folio_unico ?? item?.folio ?? '');
        const asunto = normalizeText(item?.asunto ?? '');
        if (!folio.includes(q) && !asunto.includes(q)) return false;
      }

      if (estatus) {
        const idEstatus = getIdEstatus(item);
        if (String(idEstatus ?? '') !== estatus) return false;
      }

      return true;
    });
  }, [rows, texto, filtroEstatus]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));

  useEffect(() => {
    if (page > totalPages) setPage(totalPages);
  }, [page, totalPages]);

  useEffect(() => {
    setPage(1);
  }, [texto, filtroEstatus]);

  const paged = useMemo(() => filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE), [filtered, page]);

  const handleClear = () => {
    setTexto('');
    setFiltroEstatus('');
    setPage(1);
  };

  return (
    <div className="tabla-full-container">
      <div className="tabla-header-row">
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', flexWrap: 'wrap' }}>
          <h2 className="tabla-titulo">Correspondencia Registrada Interna</h2>
          <span
            style={{
              background: '#E2E8F0',
              color: '#0F172A',
              padding: '4px 10px',
              borderRadius: 999,
              fontSize: '0.8rem',
              fontWeight: 700
            }}
          >
            {filtered.length} registros
          </span>
        </div>

        <button type="button" className="btn-secundario-corr" onClick={() => window.location.reload()} disabled={loading}>
          Actualizar lista
        </button>
      </div>

      <div className="tabla-toolbar">
        <input
          type="text"
          placeholder="Buscar por folio, asunto..."
          value={texto}
          onChange={(e) => setTexto(e.target.value)}
          disabled={loading}
          style={{
            padding: '7px 10px',
            border: '1px solid #cbd5e1',
            borderRadius: 6,
            fontSize: '0.85rem',
            minWidth: 240
          }}
        />

        <select
          value={filtroEstatus}
          onChange={(e) => setFiltroEstatus(e.target.value)}
          disabled={loading}
          className="admin-view-select"
        >
          <option value="">Todos</option>
          {estatusOptions.map((o) => (
            <option key={o.value} value={o.value}>
              {o.label}
            </option>
          ))}
        </select>

        <button type="button" className="btn-secundario-corr" onClick={handleClear} disabled={loading}>
          Limpiar filtros
        </button>
      </div>

      {loading ? (
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', padding: '1rem 0', color: '#64748b' }}>
          <span className="spinner-corr" />
          <span style={{ fontWeight: 600 }}>Cargando correspondencias...</span>
        </div>
      ) : (
        <div className="tabla-scroll-wrapper">
          <table className="tabla-correspondencias-full">
            <thead>
              <tr>
                <th>#</th>
                <th>Folio Único</th>
                <th>No. Oficio</th>
                <th>Asunto</th>
                <th>Fecha Recibido</th>
                <th>Estatus</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {paged.length === 0 ? (
                <tr>
                  <td colSpan={7} style={{ padding: '1rem', color: '#64748b' }}>
                    No hay correspondencias con los filtros actuales.
                  </td>
                </tr>
              ) : (
                paged.map((item, idx) => {
                  const id = getId(item);
                  const folio = item?.folioUnico ?? item?.folio_unico ?? item?.folio ?? '';
                  const oficio =
                    item?.numOficioExterno ??
                    item?.num_oficio_externo ??
                    item?.numeroOficio ??
                    item?.numOficio ??
                    '';
                  const asunto = item?.asunto ?? '';
                  const fechaRecibido = safeDateLabel(item?.fechaRecibido ?? item?.fecha_recibido ?? item?.fecha ?? '');
                  const estatusLabel = getEstatusLabel(item);
                  const badge = getEstatusColors(estatusLabel);

                  return (
                    <tr key={id ?? `${idx}`}>
                      <td style={{ whiteSpace: 'nowrap' }}>{(page - 1) * PAGE_SIZE + idx + 1}</td>
                      <td style={{ whiteSpace: 'nowrap' }}>{folio || '—'}</td>
                      <td style={{ whiteSpace: 'nowrap' }}>{oficio || '—'}</td>
                      <td title={asunto || ''} style={{ maxWidth: 420, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                        {asunto || '—'}
                      </td>
                      <td style={{ whiteSpace: 'nowrap' }}>{fechaRecibido || '—'}</td>
                      <td style={{ whiteSpace: 'nowrap' }}>
                        <span className="badge-estado" style={{ background: badge.bg, color: badge.fg }}>
                          {estatusLabel}
                        </span>
                      </td>
                      <td>
                        <div className="acciones-cell">
                          <button type="button" className="btn-generar-oficio" onClick={() => onGenerarOficio?.(item)}>
                            Generar Oficio
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      )}

      <div className="tabla-paginacion">
        <div>
          Página {page} de {totalPages}
        </div>
        <div style={{ display: 'flex', gap: 8 }}>
          <button
            type="button"
            className="btn-secundario-corr"
            disabled={loading || page === 1}
            onClick={() => setPage((p) => Math.max(1, p - 1))}
          >
            Anterior
          </button>
          <button
            type="button"
            className="btn-secundario-corr"
            disabled={loading || page >= totalPages}
            onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
          >
            Siguiente
          </button>
        </div>
      </div>
    </div>
  );
};

export default TablaCorrespondenciasInterna;
