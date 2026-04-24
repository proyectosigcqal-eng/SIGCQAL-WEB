import React, { useRef } from 'react';

const formatFileSize = (bytes) => {
  if (typeof bytes !== 'number') return '';
  const mb = bytes / (1024 * 1024);
  if (mb >= 1) return `${mb.toFixed(1)} MB`;
  const kb = bytes / 1024;
  return `${Math.max(1, Math.round(kb))} KB`;
};

export const PanelArchivoAdjunto = ({
  archivoSeleccionado,
  archivoPreview,
  archivoConfirmado,
  errorArchivo,
  onArchivoChange,
  onQuitarArchivo
}) => {
  const inputRef = useRef(null);

  const triggerFilePicker = () => {
    inputRef.current?.click();
  };

  const handleDrop = (e) => {
    e.preventDefault();
    const file = e.dataTransfer?.files?.[0];
    if (!file) return;
    onArchivoChange({ target: { files: [file] } });
  };

  const handleDragOver = (e) => {
    e.preventDefault();
  };

  const baseClasses = ['zona-archivo'];
  if (errorArchivo) baseClasses.push('archivo-error');
  if (archivoSeleccionado) baseClasses.push('archivo-cargado');
  if (archivoSeleccionado && !archivoConfirmado) baseClasses.push('archivo-pendiente');
  if (archivoSeleccionado && archivoConfirmado) baseClasses.push('archivo-confirmado');

  return (
    <div>
      <div
        className={baseClasses.join(' ')}
        role="button"
        tabIndex={0}
        onClick={triggerFilePicker}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') triggerFilePicker();
        }}
        onDrop={handleDrop}
        onDragOver={handleDragOver}
      >
        <input
          ref={inputRef}
          type="file"
          accept=".pdf,.jpg,.jpeg,.png"
          onChange={onArchivoChange}
          style={{ display: 'none' }}
        />

        {!archivoSeleccionado ? (
          <div>
            <div style={{ fontWeight: 700, color: 'var(--text-main)' }}>
              Haz clic o arrastra el documento digitalizado
            </div>
            <div style={{ marginTop: '0.4rem', color: 'var(--text-muted)', fontSize: '0.85rem' }}>
              PDF, JPG o PNG · Máx. 10 MB
            </div>
          </div>
        ) : (
          <div>
            <div style={{ fontWeight: 700, color: 'var(--text-main)' }}>
              {archivoConfirmado ? 'Documento confirmado' : 'Documento seleccionado'}
            </div>
            <div className="preview-archivo">
              {archivoSeleccionado.type?.startsWith('image/') && archivoPreview ? (
                <img
                  src={archivoPreview}
                  alt="Vista previa"
                  style={{ width: 48, height: 48, objectFit: 'cover', borderRadius: 8, border: '1px solid var(--border)' }}
                />
              ) : null}
              <div>
                <div className="preview-nombre">{archivoSeleccionado.name}</div>
                <div className="preview-size">{formatFileSize(archivoSeleccionado.size)}</div>
              </div>
              {archivoConfirmado ? (
                <button type="button" className="btn-secundario-corr" onClick={triggerFilePicker}>
                  Cambiar archivo
                </button>
              ) : (
                <button type="button" className="btn-peligro" onClick={onQuitarArchivo}>
                  Quitar
                </button>
              )}
            </div>
          </div>
        )}
      </div>

      {errorArchivo ? (
        <div className="campo-error-msg" style={{ marginTop: '0.5rem' }}>
          {errorArchivo}
        </div>
      ) : null}
    </div>
  );
};
