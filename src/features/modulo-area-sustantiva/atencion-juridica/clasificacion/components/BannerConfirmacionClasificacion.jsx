import { useMemo } from 'react';

const getValue = (value, fallback = '—') => {
  if (value === null || value === undefined) return fallback;
  const v = String(value).trim();
  return v ? v : fallback;
};

export const BannerConfirmacionClasificacion = ({ status, message, detalles, onCerrar }) => {
  const title = useMemo(() => {
    if (status === 'success') return '¡Clasificación confirmada!';
    if (status === 'error') return 'No se pudo confirmar';
    return null;
  }, [status]);

  if (!status) return null;

  return (
    <div className={`aj-banner ${status === 'success' ? 'is-success' : 'is-error'}`}>
      <div className="aj-banner-top">
        <div className="aj-banner-icon" aria-hidden="true">
          {status === 'success' ? '✅' : '⚠️'}
        </div>
        <div className="aj-banner-main">
          <div className="aj-banner-title">{title}</div>
          <div className="aj-banner-msg">{message}</div>
        </div>
        <button type="button" className="aj-banner-close" onClick={onCerrar} aria-label="Cerrar">
          ×
        </button>
      </div>

      <div className="aj-banner-grid">
        <div className="aj-info-card">
          <div>
            <strong>Folio Gobierno:</strong> {getValue(detalles?.folioGobierno)}
          </div>
          <div>
            <strong>Contribuyente:</strong> {getValue(detalles?.nombreContribuyente)}
          </div>
          <div>
            <strong>Trámite:</strong> {getValue(detalles?.tramite)}
          </div>
        </div>

        <div className="aj-info-card">
          <div>
            <strong>Tipo de asesoría:</strong> {getValue(detalles?.tipoAsesoria)}
          </div>
          <div>
            <strong>Tipo de acto:</strong> {getValue(detalles?.tipoActo)}
          </div>
          <div>
            <strong>Calificación del acto:</strong> {getValue(detalles?.calificacionActo)}
          </div>
        </div>
      </div>
    </div>
  );
};

