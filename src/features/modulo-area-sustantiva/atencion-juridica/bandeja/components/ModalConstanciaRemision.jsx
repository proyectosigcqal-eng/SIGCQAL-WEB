export const ModalConstanciaRemision = ({
  abierta,
  onCerrar,
  onConfirmar,
  cargandoPreview,
  generando,
  preview,
  analisisJuridico,
  determinacion,
  onChangeAnalisisJuridico,
  onChangeDeterminacion,
  error,
}) => {
  if (!abierta) return null;

  const puedeConfirmar =
    !cargandoPreview &&
    !generando &&
    !!preview?.puedeGenerar &&
    !!analisisJuridico?.trim();

  return (
    <div className="ficha-modal-overlay" role="dialog" aria-modal="true">
      <div className="ficha-modal">
        <div className="ficha-modal-header">
          <div className="ficha-modal-title">VISTA PREVIA – CONSTANCIA INTERNA DE REMISIÓN</div>
          <button className="ficha-modal-close" onClick={onCerrar} aria-label="Cerrar">
            ×
          </button>
        </div>

        <div className="ficha-modal-body">
          {cargandoPreview ? (
            <div className="ficha-modal-loading">Cargando vista previa...</div>
          ) : (
            <div className="ficha-modal-grid">
              <div>
                <div className="ficha-field-label">FOLIO DE ASESORÍA</div>
                <div className="ficha-field-value">{preview?.folioAsesoria || '-'}</div>
              </div>
              <div>
                <div className="ficha-field-label">NÚMERO DE CONSTANCIA</div>
                <div className="ficha-field-value">{preview?.numeroConstancia || '-'}</div>
              </div>
              <div>
                <div className="ficha-field-label">QUEJOSO / CONTRIBUYENTE</div>
                <div className="ficha-field-value">{preview?.nombreQuejoso || '-'}</div>
              </div>
              <div>
                <div className="ficha-field-label">ASESOR JURÍDICO</div>
                <div className="ficha-field-value">{preview?.asesorEmisor || '-'}</div>
              </div>
              <div className="ficha-modal-colspan">
                <div className="ficha-field-label">AUTORIDAD RESPONSABLE</div>
                <div className="ficha-field-value">{preview?.autoridadResponsable || '-'}</div>
              </div>
              <div className="ficha-modal-colspan">
                <div className="ficha-field-label">ASUNTO</div>
                <div className="ficha-modal-text">{preview?.asunto || '-'}</div>
              </div>
              <div className="ficha-modal-colspan">
                <div className="ficha-field-label">
                  ANÁLISIS JURÍDICO <span className="ficha-modal-required">*</span>
                </div>
                <textarea
                  className="ficha-modal-textarea"
                  value={analisisJuridico}
                  onChange={(e) => onChangeAnalisisJuridico(e.target.value)}
                  rows={6}
                  placeholder="Capture el análisis jurídico de la remisión."
                  disabled={generando}
                />
              </div>
              <div className="ficha-modal-colspan">
                <div className="ficha-field-label">DETERMINACIÓN</div>
                <textarea
                  className="ficha-modal-textarea"
                  value={determinacion}
                  onChange={(e) => onChangeDeterminacion(e.target.value)}
                  rows={4}
                  placeholder="Capture la determinación, si aplica."
                  disabled={generando}
                />
              </div>
            </div>
          )}

          {!cargandoPreview && preview?.puedeGenerar === false && preview?.motivoBloqueo ? (
            <div className="ficha-modal-alert ficha-modal-alert--error">
              <div className="ficha-modal-alert-title">Generación bloqueada</div>
              <div className="ficha-modal-alert-text">{preview.motivoBloqueo}</div>
            </div>
          ) : null}

          {!cargandoPreview && !analisisJuridico?.trim() ? (
            <div className="ficha-modal-helper">El campo análisis jurídico es requerido para generar la constancia.</div>
          ) : null}

          {error ? (
            <div className="ficha-modal-alert ficha-modal-alert--error">
              <div className="ficha-modal-alert-title">Error</div>
              <div className="ficha-modal-alert-text">{error}</div>
            </div>
          ) : null}
        </div>

        <div className="ficha-modal-actions">
          <button className="ficha-btn-secondary" onClick={onCerrar} disabled={generando}>
            CANCELAR
          </button>
          <button
            className="ficha-btn-primary"
            onClick={onConfirmar}
            disabled={!puedeConfirmar}
          >
            {cargandoPreview ? 'CARGANDO...' : generando ? 'GENERANDO...' : 'GENERAR CONSTANCIA'}
          </button>
        </div>
      </div>
    </div>
  );
};

