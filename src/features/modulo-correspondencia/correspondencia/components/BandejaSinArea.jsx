import React, { useMemo } from 'react';

const getValue = (value, fallback = '—') => {
  if (value === null || value === undefined) return fallback;
  const v = String(value).trim();
  return v ? v : fallback;
};

export const BandejaSinArea = ({ correspondencias = [], onGenerarMemorandum }) => {
  const items = useMemo(() => {
    if (!Array.isArray(correspondencias)) return [];
    return correspondencias;
  }, [correspondencias]);

  return (
    <div className="form-container-corr" style={{ maxWidth: 1200 }}>
      <div className="form-card-corr">
        <div className="bandeja-sin-area-header">
          <h2 style={{ margin: 0, fontSize: '1rem', fontWeight: 700, color: 'var(--text-main)' }}>
            Correspondencias pendientes de asignación
          </h2>
          <span className="badge-sin-area">{items.length} sin área</span>
        </div>

        {items.length === 0 ? (
          <div style={{ color: 'var(--text-muted)', padding: '1rem 0' }}>
            No hay correspondencias sin área asignada.
          </div>
        ) : (
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ textAlign: 'left' }}>
                  <th style={{ padding: '0.75rem', borderBottom: '1px solid var(--border)' }}>Folio Único</th>
                  <th style={{ padding: '0.75rem', borderBottom: '1px solid var(--border)' }}>No. Oficio</th>
                  <th style={{ padding: '0.75rem', borderBottom: '1px solid var(--border)' }}>Dependencia Remitente</th>
                  <th style={{ padding: '0.75rem', borderBottom: '1px solid var(--border)' }}>Asunto</th>
                  <th style={{ padding: '0.75rem', borderBottom: '1px solid var(--border)' }}>Fecha Recibido</th>
                  <th style={{ padding: '0.75rem', borderBottom: '1px solid var(--border)' }}>Acciones</th>
                </tr>
              </thead>
              <tbody>
                {items.map((item) => (
                  <tr key={item.id || item.folioUnico || item.folio || JSON.stringify(item)}>
                    <td style={{ padding: '0.75rem', borderBottom: '1px solid var(--border)' }}>
                      {getValue(item.folioUnico || item.folio || item.folioGenerado)}
                    </td>
                    <td style={{ padding: '0.75rem', borderBottom: '1px solid var(--border)' }}>
                      {getValue(item.numeroOficio || item.noOficio)}
                    </td>
                    <td style={{ padding: '0.75rem', borderBottom: '1px solid var(--border)' }}>
                      {getValue(item.dependenciaRemitente || item.dependencia)}
                    </td>
                    <td style={{ padding: '0.75rem', borderBottom: '1px solid var(--border)' }}>
                      {getValue(item.asunto)}
                    </td>
                    <td style={{ padding: '0.75rem', borderBottom: '1px solid var(--border)' }}>
                      {getValue(item.fechaRecibido || item.fecha)}
                    </td>
                    <td style={{ padding: '0.75rem', borderBottom: '1px solid var(--border)' }}>
                      <button
                        type="button"
                        className="btn-primario-corr"
                        style={{ padding: '0.5rem 0.9rem' }}
                        onClick={() => onGenerarMemorandum?.(item, 'bandeja-sin-area')}
                      >
                        Generar Memorándum
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

