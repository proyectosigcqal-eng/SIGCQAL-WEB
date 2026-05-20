import React, { useEffect, useMemo, useState } from 'react';
import { hasAreaAsignada } from '../utils/correspondenciaUtils';
import { formatDateTimeDisplay } from '@/shared/utils/dateUtils';

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
  return formatDateTimeDisplay(value);
};

const getId = (item) =>
  item?.id ??
  item?.idCorrespondencia ??
  item?.correspondenciaId ??
  item?.id_correspondencia ??
  null;

const getIdArea = (item) => item?.idArea ?? item?.id_area ?? null;

const getAreaLabel = (item) =>
  item?.nombreArea ??
  item?.nombre_area ??
  item?.areaAsignada ??
  item?.area_asignada ??
  item?.area?.nombre ??
  item?.area?.nombreArea ??
  null;

const getIdEstatus = (item) => item?.idEstatus ?? item?.id_estatus ?? null;

const getEstatusLabel = (item) => {
  const raw = item?.idEstatus ?? item?.id_estatus;
  if (raw === 1 || raw === null || raw === undefined) return 'Registrado';
  if (raw === 2) return 'Asignado';
  if (raw === 3) return 'En Seguimiento';
  if (raw === 4) return 'Concluido';
  return String(raw);
};

const getEstatusColors = (label) => {
  const n = normalizeText(label);
  if (n.includes('registr')) return { bg: '#DBEAFE', fg: '#1D4ED8' };
  if (n.includes('asign')) return { bg: '#FEF3C7', fg: '#B45309' };
  if (n.includes('seguim')) return { bg: '#DCFCE7', fg: '#166534' };
  if (n.includes('conclu') || n.includes('cerrad') || n.includes('final')) return { bg: '#E5E7EB', fg: '#374151' };
  return { bg: '#E2E8F0', fg: '#0F172A' };
};

const buildOptions = (items, getIdFn, getLabelFn) => {
  const map = new Map();
  asArray(items).forEach((it) => {
    const id = getIdFn(it);
    if (id === null || id === undefined || String(id).trim() === '') return;
    const key = String(id);
    if (map.has(key)) return;
    const label = getLabelFn(it);
    map.set(key, label);
  });
  return Array.from(map.entries()).map(([value, label]) => ({ value, label }));
};

export const TablaCorrespondenciasExterna = ({ correspondencias = [], onGenerarMemo, onGenerarOficio, loading }) => {
  const [texto, setTexto] = useState('');
  const [filtroArea, setFiltroArea] = useState('');
  const [filtroEstatus, setFiltroEstatus] = useState('');
  const [page, setPage] = useState(1);

  const rows = useMemo(() => asArray(correspondencias), [correspondencias]);

  const areaOptions = useMemo(
    () =>
      buildOptions(
        rows,
        (it) => getIdArea(it),
        (it) => {
          const label = getAreaLabel(it);
          const id = getIdArea(it);
          return label ? String(label) : id != null ? `Área ${id}` : 'Sin asignar';
        }
      ),
    [rows]
  );

  const estatusOptions = useMemo(
    () =>
      buildOptions(
        rows,
        (it) => getIdEstatus(it),
        (it) => getEstatusLabel(it)
      ),
    [rows]
  );

  const filtered = useMemo(() => {
    const q = normalizeText(texto);
    const area = String(filtroArea || '');
    const estatus = String(filtroEstatus || '');

    return rows.filter((item) => {
      if (q) {
        const folio = normalizeText(item?.folioUnico ?? item?.folio_unico ?? '');
        const remitente = normalizeText(item?.dependenciaRemitente ?? item?.dependencia_remitente ?? '');
        const asunto = normalizeText(item?.asunto ?? '');
        if (!folio.includes(q) && !remitente.includes(q) && !asunto.includes(q)) return false;
      }

      if (area) {
        const idArea = getIdArea(item);
        if (String(idArea ?? '') !== area) return false;
      }

      if (estatus) {
        const idEstatus = getIdEstatus(item);
        if (String(idEstatus ?? '') !== estatus) return false;
      }

      return true;
    });
  }, [rows, texto, filtroArea, filtroEstatus]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));

  useEffect(() => {
    if (page > totalPages) setPage(totalPages);
  }, [page, totalPages]);

  useEffect(() => {
    setPage(1);
  }, [texto, filtroArea, filtroEstatus]);

  const paged = useMemo(() => filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE), [filtered, page]);

  const handleClear = () => {
    setTexto('');
    setFiltroArea('');
    setFiltroEstatus('');
    setPage(1);
  };

  return (
    <div className="tabla-full-container">
      <div className="tabla-header-row">
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', flexWrap: 'wrap' }}>
          <h2 className="tabla-titulo">Correspondencia Registrada Externa</h2>
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
          placeholder="Buscar por folio, remitente..."
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
          value={filtroArea}
          onChange={(e) => setFiltroArea(e.target.value)}
          disabled={loading}
          className="admin-view-select"
        >
          <option value="">Todas las áreas</option>
          {areaOptions.map((o) => (
            <option key={o.value} value={o.value}>
              {o.label}
            </option>
          ))}
        </select>

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
                <th>Dependencia Remitente</th>
                <th>Destinatario</th>
                <th>Asunto</th>
                <th>Fecha Recibido</th>
                <th>Área Asignada</th>
                <th>Estatus</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {paged.length === 0 ? (
                <tr>
                  <td colSpan={10} style={{ padding: '1rem', color: '#64748b' }}>
                    No hay correspondencias con los filtros actuales.
                  </td>
                </tr>
              ) : (
                paged.map((item, idx) => {
                  const id = getId(item);
                  const folio = item?.folioUnico ?? item?.folio_unico ?? '—';
                  const oficio = item?.numeroOficio ?? item?.num_oficio_externo ?? '—';
                  const remitente = item?.dependenciaRemitente ?? item?.dependencia_remitente ?? '—';
                  const destinatario = item?.titularDependencia ?? item?.nombre_remitente ?? '—';
                  const asunto = item?.asunto ?? '—';
                  const fecha = item?.fechaRecibido ?? item?.fecha_recibido ?? '—';
                  const fechaRecibido = safeDateLabel(fecha);

                  const nombreArea = item?.nombreArea ?? item?.nombre_area ?? null;
                  const idArea = item?.idArea ?? item?.id_area ?? null;
                  const hasArea = idArea !== null && idArea !== undefined && String(idArea).trim() !== '';
                  const areaLabelRaw = nombreArea ?? getAreaLabel(item);
                  const areaLabel = hasArea ? areaLabelRaw || `Área ${idArea}` : 'Sin asignar';

                  const estatusLabel = getEstatusLabel(item);
                  const badge = getEstatusColors(estatusLabel);

                  return (
                    <tr key={id ?? `${idx}`}> 
                      <td style={{ whiteSpace: 'nowrap' }}>{(page - 1) * PAGE_SIZE + idx + 1}</td>
                      <td style={{ whiteSpace: 'nowrap' }}>{folio}</td>
                      <td style={{ whiteSpace: 'nowrap' }}>{oficio}</td>
                      <td>{remitente}</td>
                      <td>{destinatario}</td>
                      <td
                        title={asunto || ''}
                        style={{ maxWidth: 320, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}
                      >
                        {asunto}
                      </td>
                      <td style={{ whiteSpace: 'nowrap' }}>{fechaRecibido || '—'}</td>
                      <td>
                        <span
                          style={
                            hasArea
                              ? { background: '#EEF2FF', color: '#3730A3', padding: '4px 10px', borderRadius: 12, fontWeight: 600, fontSize: '0.8rem' }
                              : { background: '#FEF3C7', color: '#D97706', padding: '4px 10px', borderRadius: 12, fontWeight: 600, fontSize: '0.8rem' }
                          }
                        >
                          {areaLabel}
                        </span>
                      </td>
                      <td style={{ whiteSpace: 'nowrap' }}>
                        <span className="badge-estado" style={{ background: badge.bg, color: badge.fg }}>
                          {estatusLabel}
                        </span>
                      </td>
                      <td style={{ padding: '10px 12px' }}>
                        <div className="acciones-cell">
                          {!hasAreaAsignada(item) && (
                            <>
                              <button type="button" className="btn-generar-memo" onClick={() => onGenerarMemo?.(item)}>
                                Generar Memo
                              </button>
                              <button type="button" className="btn-generar-oficio" onClick={() => onGenerarOficio?.(item)}>
                                Generar Oficio
                              </button>
                            </>
                          )}
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

export default TablaCorrespondenciasExterna;
