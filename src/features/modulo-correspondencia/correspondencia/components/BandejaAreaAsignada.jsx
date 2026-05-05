import React, { useMemo } from 'react';
import { useNavigate } from 'react-router-dom';

const getValue = (value, fallback = '—') => {
  if (value === null || value === undefined) return fallback;
  const v = String(value).trim();
  return v ? v : fallback;
};

export const BandejaAreaAsignada = ({ correspondencia, areaSeleccionada, onNuevoRegistro }) => {
  const navigate = useNavigate();

  const id = useMemo(() => {
    return (
      correspondencia?.id ||
      correspondencia?.idCorrespondencia ||
      correspondencia?.correspondenciaId ||
      null
    );
  }, [correspondencia]);

  const folio =
    correspondencia?.folioUnico ||
    correspondencia?.folio ||
    correspondencia?.folioGenerado ||
    correspondencia?.consecutivo ||
    null;

  return (
    <div className="banner-exito-area">
      <div className="banner-exito-icon">✅</div>
      <h2 style={{ margin: 0, fontSize: '1.15rem', fontWeight: 800, color: '#166534' }}>
        ¡Área asignada exitosamente!
      </h2>

      <div className="acuse-info-card">
        <div style={{ display: 'grid', gap: '0.35rem' }}>
          <div>
            <strong>Folio:</strong> {getValue(folio)}
          </div>
          <div>
            <strong>Área asignada:</strong> {getValue(areaSeleccionada?.nombre)}
          </div>
          <div>
            <strong>Fecha:</strong> {getValue(correspondencia?.fechaRecibido || correspondencia?.fecha)}
          </div>
        </div>
      </div>

      <div className="acuse-info-card">
        <div style={{ fontWeight: 700, color: 'var(--text-main)', marginBottom: '0.5rem' }}>Acuse de recibo</div>
        <div style={{ color: 'var(--text-muted)' }}>
          Se ha notificado a {getValue(areaSeleccionada?.nombre)} sobre la correspondencia {getValue(folio)}
        </div>
        <div className="badge-notificado">Notificación enviada</div>
      </div>

      <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'center', flexWrap: 'wrap' }}>
        <button type="button" className="btn-primario-corr" onClick={() => onNuevoRegistro?.()}>
          Registrar otra correspondencia
        </button>
        <button
          type="button"
          className="btn-secundario-corr"
          disabled={!id}
          onClick={() => (id ? navigate(`/correspondencia/bitacora/${id}`) : null)}
        >
          Ver bitácora
        </button>
      </div>
    </div>
  );
};

