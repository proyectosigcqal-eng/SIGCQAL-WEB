import React, { useMemo, useState } from 'react';
import { hasAreaAsignada, shouldMostrarGenerarMemorandum } from '../utils/correspondenciaUtils';

const norm = (value) => String(value ?? '').toLowerCase();

const getValue = (value, fallback = '—') => {
  if (value === null || value === undefined) return fallback;
  const v = String(value).trim();
  return v ? v : fallback;
};

export const AdminViewCorrespondencias = ({ correspondencias = [], areas = [], onGenerarMemorandum }) => {
  const [filtroArea, setFiltroArea] = useState('');
  const [filtroAsignacion, setFiltroAsignacion] = useState('TODAS');
  const [busqueda, setBusqueda] = useState('');

  const areaPorId = useMemo(() => {
    const map = new Map();
    (Array.isArray(areas) ? areas : []).forEach((a) => {
      map.set(String(a.id), a);
    });
    return map;
  }, [areas]);

  const items = useMemo(() => {
    const base = Array.isArray(correspondencias) ? correspondencias : [];
    const texto = norm(busqueda);

    return base
      .filter((c) => {
        if (!filtroArea) return true;
        return String(c.idArea ?? '') === String(filtroArea);
      })
      .filter((c) => {
        if (filtroAsignacion === 'TODAS') return true;
        const tieneArea = hasAreaAsignada(c);
        if (filtroAsignacion === 'SIN_AREA') return !tieneArea;
        if (filtroAsignacion === 'CON_AREA') return tieneArea;
        return true;
      })
      .filter((c) => {
        if (!texto) return true;
        const folio = norm(c.folioUnico || c.folio || c.folioGenerado);
        const dep = norm(c.dependenciaRemitente || c.dependencia);
        return folio.includes(texto) || dep.includes(texto);
      });
  }, [busqueda, correspondencias, filtroArea, filtroAsignacion]);

  return (
    <div className="form-container-corr" style={{ maxWidth: 1200 }}>
      <div className="form-card-corr">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', gap: '1rem' }}>
          <h2 style={{ margin: 0, fontSize: '1rem', fontWeight: 700, color: 'var(--text-main)' }}>Vista admin</h2>
          <div style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>{items.length} resultados</div>
        </div>

        <div className="admin-view-toolbar">
          <select className="admin-view-select" value={filtroArea} onChange={(e) => setFiltroArea(e.target.value)}>
            <option value="">Todas las áreas</option>
            {(Array.isArray(areas) ? areas : []).map((a) => (
              <option key={a.id} value={a.id}>
                {a.nombre}
              </option>
            ))}
          </select>

          <select
            className="admin-view-select"
            value={filtroAsignacion}
            onChange={(e) => setFiltroAsignacion(e.target.value)}
          >
            <option value="TODAS">Todas</option>
            <option value="SIN_AREA">Sin área</option>
            <option value="CON_AREA">Con área</option>
          </select>

          <input
            className="admin-view-select"
            value={busqueda}
            onChange={(e) => setBusqueda(e.target.value)}
            placeholder="Buscar por folio o dependencia..."
            style={{ flex: 1, minWidth: 220 }}
          />
        </div>

        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ textAlign: 'left' }}>
                <th style={{ padding: '0.75rem', borderBottom: '1px solid var(--border)' }}>Folio Único</th>
                <th style={{ padding: '0.75rem', borderBottom: '1px solid var(--border)' }}>No. Oficio</th>
                <th style={{ padding: '0.75rem', borderBottom: '1px solid var(--border)' }}>Dependencia Remitente</th>
                <th style={{ padding: '0.75rem', borderBottom: '1px solid var(--border)' }}>Área Asignada</th>
                <th style={{ padding: '0.75rem', borderBottom: '1px solid var(--border)' }}>Estatus</th>
                <th style={{ padding: '0.75rem', borderBottom: '1px solid var(--border)' }}>Fecha Recibido</th>
                <th style={{ padding: '0.75rem', borderBottom: '1px solid var(--border)' }}>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {items.length === 0 ? (
                <tr>
                  <td colSpan={7} style={{ padding: '1rem 0.75rem', color: 'var(--text-muted)' }}>
                    Sin resultados con los filtros actuales.
                  </td>
                </tr>
              ) : (
                items.map((c) => {
                  const tieneArea = hasAreaAsignada(c);
                  const area = c?.idArea ? areaPorId.get(String(c.idArea)) : null;
                  const estatus = c.estatus || c.nombreEstatus || c.idEstatus;

                  return (
                    <tr key={c.id || c.folioUnico || c.folio || JSON.stringify(c)}>
                      <td style={{ padding: '0.75rem', borderBottom: '1px solid var(--border)' }}>
                        {getValue(c.folioUnico || c.folio || c.folioGenerado)}
                      </td>
                      <td style={{ padding: '0.75rem', borderBottom: '1px solid var(--border)' }}>
                        {getValue(c.numeroOficio || c.noOficio)}
                      </td>
                      <td style={{ padding: '0.75rem', borderBottom: '1px solid var(--border)' }}>
                        {getValue(c.dependenciaRemitente || c.dependencia)}
                      </td>
                      <td style={{ padding: '0.75rem', borderBottom: '1px solid var(--border)' }}>
                        {tieneArea ? (
                          <span style={{ display: 'inline-flex', padding: '4px 10px', borderRadius: 12, background: '#eef2ff', color: '#3730a3', fontWeight: 600, fontSize: '0.8rem' }}>
                            {area?.nombre || `Área ${c.idArea}`}
                          </span>
                        ) : (
                          <span className="badge-sin-area">Sin asignar</span>
                        )}
                      </td>
                      <td style={{ padding: '0.75rem', borderBottom: '1px solid var(--border)' }}>
                        <span style={{ display: 'inline-flex', padding: '4px 10px', borderRadius: 12, background: '#f1f5f9', color: '#0f172a', fontWeight: 600, fontSize: '0.8rem' }}>
                          {getValue(estatus)}
                        </span>
                      </td>
                      <td style={{ padding: '0.75rem', borderBottom: '1px solid var(--border)' }}>
                        {getValue(c.fechaRecibido || c.fecha)}
                      </td>
                      <td style={{ padding: '0.75rem', borderBottom: '1px solid var(--border)' }}>
                        {shouldMostrarGenerarMemorandum(c) ? (
                          <button
                            type="button"
                            className="btn-primario-corr"
                            style={{ padding: '0.5rem 0.9rem' }}
                            onClick={() => onGenerarMemorandum?.(c, 'admin-view')}
                          >
                            Generar Memorándum
                          </button>
                        ) : null}
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

