import { useCallback, useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import {
  listarCorrespondencias
} from '@/features/modulo-correspondencia/correspondencia/services/correspondenciaService';
import { getAreas } from '@/shared/services/catalogosServices';
import {
  AREA_FILTER_SIN_ASIGNAR,
  hasAreaAsignada,
  matchesAreasFilter,
  shouldMostrarGenerarMemorandum
} from '@/features/modulo-correspondencia/correspondencia/utils/correspondenciaUtils';
import '@/features/modulo-correspondencia/correspondencia/styles/correspondencia.css';

const PAGE_SIZE = 10;

const normalizeText = (value) =>
  String(value ?? '')
    .trim()
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '');

const getId = (item) =>
  item?.id ||
  item?.idCorrespondencia ||
  item?.correspondenciaId ||
  item?.id_correspondencia ||
  null;

const getFechaLabel = (value) => {
  if (!value) return '—';
  const d = value instanceof Date ? value : new Date(value);
  if (Number.isNaN(d.getTime())) return String(value);
  try {
    return d.toLocaleDateString('es-MX');
  } catch {
    return d.toISOString().slice(0, 10);
  }
};

const getEstatusLabel = (item) => {
  const raw =
    item?.estatus ??
    item?.estatusNombre ??
    item?.nombreEstatus ??
    item?.descripcionEstatus ??
    item?.estatusDescripcion ??
    item?.idEstatus ??
    item?.id_estatus ??
    item?.idEstatusIndividual ??
    item?.id_estatus_individual;

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
  if (n.includes('conclu')) return { bg: '#E5E7EB', fg: '#374151' };
  return { bg: '#E2E8F0', fg: '#0F172A' };
};

export const CorrespondenciasRegistradasPage = () => {
  const navigate = useNavigate();
  const [correspondencias, setCorrespondencias] = useState([]);
  const [areas, setAreas] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const [filtroRemitente, setFiltroRemitente] = useState('');
  const [filtroFecha, setFiltroFecha] = useState('');
  const [filtroEstado, setFiltroEstado] = useState('');
  const [filtroAreas, setFiltroAreas] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [sortConfig, setSortConfig] = useState({ key: 'fecha', direction: 'desc' });

  const cargarDatos = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const [data, areasResp] = await Promise.all([listarCorrespondencias(), getAreas()]);
      setCorrespondencias(Array.isArray(data) ? data : []);
      setAreas(Array.isArray(areasResp) ? areasResp : []);
    } catch (err) {
      const mensaje =
        err?.response?.data?.message ||
        err?.response?.data?.mensaje ||
        err?.message ||
        'Ocurrió un error al cargar las correspondencias.';
      setError(mensaje);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    cargarDatos();
  }, [cargarDatos]);

  const sortedFiltered = useMemo(() => {
    const base = Array.isArray(correspondencias) ? correspondencias : [];
    const rem = normalizeText(filtroRemitente);
    const estado = normalizeText(filtroEstado);
    const fechaFiltro = String(filtroFecha || '').trim();

    const filtered = base.filter((item) => {
      const remitente = normalizeText(item?.dependenciaRemitente || item?.dependencia || '');
      const estadoItem = normalizeText(getEstatusLabel(item));
      const fechaValue = item?.fechaRecibido || item?.fecha || item?.fecha_registro || '';
      const fechaNormalized = String(fechaValue || '').slice(0, 10);

      if (rem && !remitente.includes(rem)) return false;
      if (estado && !estadoItem.includes(estado)) return false;
      if (fechaFiltro && fechaFiltro !== fechaNormalized) return false;
      if (!matchesAreasFilter(item, filtroAreas)) return false;
      return true;
    });

    const sorted = [...filtered].sort((a, b) => {
      const dir = sortConfig.direction === 'asc' ? 1 : -1;
      const key = sortConfig.key;

      const getValue = (item) => {
        if (key === 'id') return getId(item) ?? '';
        if (key === 'remitente') return item?.dependenciaRemitente || item?.dependencia || '';
        if (key === 'destinatario') return item?.titularDependencia || item?.destinatario || '';
        if (key === 'asunto') return item?.asunto || '';
        if (key === 'fecha') return item?.fechaRecibido || item?.fecha || '';
        if (key === 'estado') return getEstatusLabel(item);
        if (key === 'area') return item?.nombreArea || item?.areaAsignada || item?.idArea || '';
        return '';
      };

      const aVal = getValue(a);
      const bVal = getValue(b);

      if (aVal == null && bVal == null) return 0;
      if (aVal == null) return 1;
      if (bVal == null) return -1;

      if (typeof aVal === 'number' && typeof bVal === 'number') {
        return (aVal - bVal) * dir;
      }

      return normalizeText(aVal).localeCompare(normalizeText(bVal)) * dir;
    });

    return sorted;
  }, [correspondencias, filtroAreas, filtroEstado, filtroFecha, filtroRemitente, sortConfig]);

  const totalPages = Math.max(1, Math.ceil(sortedFiltered.length / PAGE_SIZE));
  const paged = sortedFiltered.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE);

  useEffect(() => {
    if (currentPage > totalPages) {
      setCurrentPage(totalPages);
    }
  }, [currentPage, totalPages]);

  const handleSort = (key) => {
    setCurrentPage(1);
    setSortConfig((prev) => {
      if (prev.key !== key) return { key, direction: 'asc' };
      const nextDir = prev.direction === 'asc' ? 'desc' : 'asc';
      return { key, direction: nextDir };
    });
  };

  const handleNavigateMemorandum = (item) => {
    const id = getId(item);
    if (!id) return;
    navigate('/correspondencia/nuevo-memorandum', { state: { idCorrespondencia: id, from: 'registradas' } });
  };

  const handleResetFilters = () => {
    setFiltroRemitente('');
    setFiltroFecha('');
    setFiltroEstado('');
    setFiltroAreas([]);
    setCurrentPage(1);
  };

  const toggleArea = (value) => {
    const v = String(value);
    setCurrentPage(1);
    setFiltroAreas((prev) => {
      const base = Array.isArray(prev) ? prev.map((x) => String(x)) : [];
      if (base.includes(v)) return base.filter((x) => x !== v);
      return [...base, v];
    });
  };

  const clearAreas = () => {
    setFiltroAreas([]);
    setCurrentPage(1);
  };

  const areaOptions = useMemo(() => {
    const base = Array.isArray(areas) ? areas : [];
    return base
      .map((a) => ({
        id: a?.id,
        label: a?.nombreArea || a?.nombre || `Área ${a?.id}`
      }))
      .filter((a) => a.id !== null && a.id !== undefined && String(a.id).trim() !== '');
  }, [areas]);

  const renderHeader = (label, key) => {
    const active = sortConfig.key === key;
    const indicator = active ? (sortConfig.direction === 'asc' ? '▲' : '▼') : '↕';
    return (
      <button type="button" className="corr-sort-header" onClick={() => handleSort(key)}>
        {label}
        <span aria-hidden="true">{indicator}</span>
      </button>
    );
  };

  return (
    <div className="registrar-correspondencia-page">
      <div className="page-header-corr">
        <button type="button" className="btn-secundario-corr" onClick={() => navigate(-1)}>
          ← Correspondencia
        </button>
        <h1 className="page-title-corr">Correspondencia Registrada</h1>
        <button type="button" className="btn-secundario-corr" onClick={cargarDatos}>
          Actualizar lista
        </button>
      </div>

      <div className="form-container-corr">
        <div className="form-card-corr">
          {error ? <div className="alerta-error">{error}</div> : null}

          <div className="correspondencia-filtros">
            <input
              type="text"
              placeholder="Filtrar por remitente..."
              value={filtroRemitente}
              onChange={(e) => {
                setFiltroRemitente(e.target.value);
                setCurrentPage(1);
              }}
            />
            <input
              type="date"
              value={filtroFecha}
              onChange={(e) => {
                setFiltroFecha(e.target.value);
                setCurrentPage(1);
              }}
            />
            <select
              value={filtroEstado}
              onChange={(e) => {
                setFiltroEstado(e.target.value);
                setCurrentPage(1);
              }}
            >
              <option value="">Todos los estados</option>
              <option value="Registrado">Registrado</option>
              <option value="Asignado">Asignado</option>
              <option value="En seguimiento">En seguimiento</option>
              <option value="Concluido">Concluido</option>
            </select>
            <button type="button" className="btn-secundario-corr" onClick={handleResetFilters}>
              Limpiar filtros
            </button>
          </div>

          <div className="correspondencia-areas-filter">
            <div className="correspondencia-areas-filter-header">
              <div className="correspondencia-areas-filter-title">Áreas</div>
              <button
                type="button"
                className="btn-secundario-corr"
                onClick={clearAreas}
                disabled={filtroAreas.length === 0}
                style={{ padding: '0.45rem 0.85rem' }}
              >
                Limpiar áreas
              </button>
            </div>
            <div className="correspondencia-areas-filter-list">
              <label className="correspondencia-area-option">
                <input
                  type="checkbox"
                  checked={filtroAreas.includes(AREA_FILTER_SIN_ASIGNAR)}
                  onChange={() => toggleArea(AREA_FILTER_SIN_ASIGNAR)}
                />
                <span>Sin asignar</span>
              </label>
              {areaOptions.map((a) => (
                <label key={a.id} className="correspondencia-area-option">
                  <input
                    type="checkbox"
                    checked={filtroAreas.includes(String(a.id))}
                    onChange={() => toggleArea(a.id)}
                  />
                  <span>{a.label}</span>
                </label>
              ))}
              {areaOptions.length === 0 ? (
                <div style={{ color: 'var(--text-muted)', fontSize: '0.9rem', padding: '0.25rem 0' }}>
                  No hay áreas disponibles para filtrar.
                </div>
              ) : null}
            </div>
          </div>

          {loading ? (
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', padding: '1rem 0' }}>
              <span className="spinner-corr" />
              <span style={{ color: 'var(--text-muted)', fontWeight: 600 }}>Cargando correspondencias...</span>
            </div>
          ) : (
            <div className="correspondencias-table-wrapper">
              <table className="correspondencias-table">
                <thead>
                  <tr>
                    <th>{renderHeader('ID', 'id')}</th>
                    <th>{renderHeader('Remitente', 'remitente')}</th>
                    <th>{renderHeader('Destinatario', 'destinatario')}</th>
                    <th>{renderHeader('Asunto', 'asunto')}</th>
                    <th>{renderHeader('Fecha', 'fecha')}</th>
                    <th>{renderHeader('Estado', 'estado')}</th>
                    <th>{renderHeader('Área asignada', 'area')}</th>
                    <th>Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  {paged.length === 0 ? (
                    <tr>
                      <td colSpan={8} style={{ padding: '1rem', color: 'var(--text-muted)' }}>
                        No hay correspondencias registradas con los filtros actuales.
                      </td>
                    </tr>
                  ) : (
                    paged.map((item) => {
                      const estatusLabel = getEstatusLabel(item);
                      const badge = getEstatusColors(estatusLabel);
                      const areaLabel = hasAreaAsignada(item)
                        ? item?.nombreArea || item?.areaAsignada || `Área ${item?.idArea}`
                        : 'Sin asignar';
                      return (
                        <tr key={getId(item) || JSON.stringify(item)}>
                          <td>{getId(item) || '—'}</td>
                          <td>{item?.dependenciaRemitente || item?.dependencia || '—'}</td>
                          <td>{item?.titularDependencia || item?.destinatario || '—'}</td>
                          <td className="asunto-cell" title={item?.asunto || ''}>
                            {item?.asunto || '—'}
                          </td>
                          <td>{getFechaLabel(item?.fechaRecibido || item?.fecha)}</td>
                          <td>
                            <span className="badge-estado" style={{ background: badge.bg, color: badge.fg }}>
                              {estatusLabel}
                            </span>
                          </td>
                          <td>
                            <span className={hasAreaAsignada(item) ? 'badge-area' : 'badge-sin-area'}>
                              {areaLabel}
                            </span>
                          </td>
                          <td>
                            {shouldMostrarGenerarMemorandum(item) ? (
                              <button
                                type="button"
                                className="btn-primario-corr"
                                style={{ padding: '0.45rem 0.85rem' }}
                                onClick={() => handleNavigateMemorandum(item)}
                              >
                                Generar Memorándum
                              </button>
                            ) : (
                              <span style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>No disponible</span>
                            )}
                          </td>
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>
          )}

          <div className="correspondencia-pagination">
            <div>
              Página {currentPage} de {totalPages}
            </div>
            <div className="pagination-actions">
              <button
                type="button"
                className="btn-secundario-corr"
                disabled={currentPage === 1}
                onClick={() => setCurrentPage((prev) => Math.max(1, prev - 1))}
              >
                Anterior
              </button>
              <button
                type="button"
                className="btn-secundario-corr"
                disabled={currentPage >= totalPages}
                onClick={() => setCurrentPage((prev) => Math.min(totalPages, prev + 1))}
              >
                Siguiente
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
