import React from 'react';

export const ModalConfirmacionArchivo = ({
  visible,
  nombreArchivo,
  tamanoArchivo,
  previewUrl,
  onConfirmar,
  onRechazar
}) => {
  if (!visible) return null;

  const isImagen = /\.(png|jpe?g)$/i.test(nombreArchivo || '');

  return (
    <div className="modal-overlay" role="dialog" aria-modal="true">
      <div className="modal-card">
        <div className="modal-titulo">¿El documento cargado corresponde al oficio recibido?</div>

        <div style={{ color: 'var(--text-main)', fontSize: '0.9rem' }}>
          <div style={{ marginTop: '0.75rem' }}>
            <div style={{ fontWeight: 700 }}>Nombre</div>
            <div style={{ color: 'var(--text-muted)' }}>{nombreArchivo}</div>
          </div>

          <div style={{ marginTop: '0.75rem' }}>
            <div style={{ fontWeight: 700 }}>Tamaño</div>
            <div style={{ color: 'var(--text-muted)' }}>{tamanoArchivo}</div>
          </div>

          <div style={{ marginTop: '1rem' }}>
            {isImagen && previewUrl ? (
              <img
                src={previewUrl}
                alt="Vista previa"
                style={{ width: '100%', maxHeight: 220, objectFit: 'contain', borderRadius: 8, border: '1px solid var(--border)' }}
              />
            ) : (
              <div
                style={{
                  border: '1px solid var(--border)',
                  borderRadius: 8,
                  padding: '1rem',
                  textAlign: 'center',
                  color: 'var(--text-muted)',
                  background: '#f8fafc',
                  fontWeight: 700
                }}
              >
                PDF
              </div>
            )}
          </div>
        </div>

        <div className="modal-acciones">
          <button type="button" className="btn-secundario-corr" onClick={onRechazar}>
            No, seleccionar otro
          </button>
          <button type="button" className="btn-primario-corr" onClick={onConfirmar}>
            Sí, confirmar
          </button>
        </div>
      </div>
    </div>
  );
};
