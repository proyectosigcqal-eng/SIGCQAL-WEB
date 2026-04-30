import React from 'react';
import { AlertCircle, CheckCircle2, Loader2 } from 'lucide-react';

const getFolio = (c) => c?.folioUnico ?? c?.folio_unico ?? c?.folio ?? c?.folioGenerado ?? '';

export const IndicadorFlujo = ({
  flujoActual,
  correspondenciaRegistrada,
  onIrAMemorandum,
  onNuevoRegistro,
  error
}) => {
  if (flujoActual === 'idle') return null;

  if (flujoActual === 'registrando') {
    return (
      <div style={{ marginTop: '1rem', display: 'flex', alignItems: 'center', gap: 10 }}>
        <Loader2 size={18} className="spin" />
        <span>Registrando correspondencia...</span>
      </div>
    );
  }

  if (flujoActual === 'exitoso_acuse') {
    const folio = getFolio(correspondenciaRegistrada);
    return (
      <div className="indicador-flujo-exitoso">
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <CheckCircle2 size={18} color="#16a34a" />
          <strong>Correspondencia registrada exitosamente</strong>
        </div>
        {folio ? <div style={{ marginTop: 8 }}>Folio asignado: {folio}</div> : null}
        <div style={{ marginTop: 8 }}>Se ha generado el acuse y se notificó a la bandeja del área</div>
        <div style={{ display: 'flex', gap: 10, marginTop: 12, flexWrap: 'wrap' }}>
          <button type="button" className="btn-secundario-corr" onClick={onNuevoRegistro}>
            Registrar otra
          </button>
        </div>
      </div>
    );
  }

  if (flujoActual === 'exitoso_memorandum') {
    return (
      <div className="indicador-flujo-exitoso indicador-flujo-warning">
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <CheckCircle2 size={18} color="#d97706" />
          <strong>Registro guardado</strong>
        </div>
        <div style={{ display: 'flex', gap: 10, marginTop: 12, flexWrap: 'wrap' }}>
          <button type="button" className="btn-primario-corr" onClick={onIrAMemorandum}>
            Generar Memorándum
          </button>
          <button type="button" className="btn-secundario-corr" onClick={onNuevoRegistro}>
            Registrar otra
          </button>
        </div>
      </div>
    );
  }

  if (flujoActual === 'error') {
    return (
      <div className="indicador-flujo-error">
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <AlertCircle size={18} color="#b91c1c" />
          <strong>Error</strong>
        </div>
        <div style={{ marginTop: 8 }}>{error || 'Ocurrió un error inesperado.'}</div>
      </div>
    );
  }

  return null;
};

