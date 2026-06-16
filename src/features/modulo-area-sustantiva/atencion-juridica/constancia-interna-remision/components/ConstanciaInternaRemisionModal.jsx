import React from 'react';
import { X, CheckCircle, AlertCircle } from 'lucide-react';
import { useConstanciaInternaRemision } from '../hooks/useConstanciaInternaRemision';
import './ConstanciaInternaRemisionModal.css';

export const ConstanciaInternaRemisionModal = ({ expedienteId, onClose, onSuccess }) => {
  const {
    formData,
    handleFieldChange,
    handleSubmit,
    previewUrl,
    loading,
    error,
    success,
  } = useConstanciaInternaRemision(expedienteId);

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-cir" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>Constancia Interna de Remisión (Art. 41)</h2>
          <button
            className="close-btn"
            onClick={onClose}
            aria-label="Cerrar"
          >
            <X size={24} />
          </button>
        </div>

        {success && (
          <div className="alert alert-success">
            <CheckCircle size={20} />
            {success}
          </div>
        )}
        {error && (
          <div className="alert alert-error">
            <AlertCircle size={20} />
            {error}
          </div>
        )}

        <div className="modal-body">
          {/* Columna izquierda: Form */}
          <div className="form-section">
            <form onSubmit={handleSubmit}>
              {/* Respuesta de Autoridad */}
              <fieldset className="form-fieldset">
                <legend>Respuesta de la Autoridad</legend>

                <div className="form-group">
                  <label className="checkbox-group">
                    <input
                      type="checkbox"
                      checked={formData.autoridadContesto}
                      onChange={(e) =>
                        handleFieldChange('autoridadContesto', e.target.checked)
                      }
                    />
                    ¿Recibió respuesta de la autoridad?
                  </label>
                </div>

                {formData.autoridadContesto && (
                  <>
                    <div className="form-group">
                      <label htmlFor="informeAutoridadFecha">
                        Fecha de respuesta
                      </label>
                      <input
                        id="informeAutoridadFecha"
                        type="date"
                        value={formData.informeAutoridadFecha}
                        onChange={(e) =>
                          handleFieldChange('informeAutoridadFecha', e.target.value)
                        }
                      />
                    </div>

                    <div className="form-group">
                      <label htmlFor="informeAutoridadAsunto">
                        Asunto de respuesta
                      </label>
                      <input
                        id="informeAutoridadAsunto"
                        type="text"
                        value={formData.informeAutoridadAsunto}
                        onChange={(e) =>
                          handleFieldChange('informeAutoridadAsunto', e.target.value)
                        }
                        placeholder="Ej: Informe sobre solicitud..."
                      />
                    </div>

                    <div className="form-group">
                      <label htmlFor="informeAutoridadTexto">
                        Texto de respuesta
                      </label>
                      <textarea
                        id="informeAutoridadTexto"
                        value={formData.informeAutoridadTexto}
                        onChange={(e) =>
                          handleFieldChange('informeAutoridadTexto', e.target.value)
                        }
                        placeholder="Copia el contenido de la respuesta..."
                        rows={5}
                      />
                    </div>
                  </>
                )}
              </fieldset>

              {/* Análisis y Determinación */}
              <fieldset className="form-fieldset">
                <legend>Análisis Jurídico</legend>

                <div className="form-group">
                  <label htmlFor="analisisJuridico">
                    Análisis jurídico
                    <span className="optional">(opcional)</span>
                  </label>
                  <textarea
                    id="analisisJuridico"
                    value={formData.analisisJuridico}
                    onChange={(e) =>
                      handleFieldChange('analisisJuridico', e.target.value)
                    }
                    placeholder="Análisis jurídico de la queja..."
                    rows={4}
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="determinacion">
                    Determinación
                    <span className="optional">(opcional)</span>
                  </label>
                  <textarea
                    id="determinacion"
                    value={formData.determinacion}
                    onChange={(e) =>
                      handleFieldChange('determinacion', e.target.value)
                    }
                    placeholder="Determinación..."
                    rows={3}
                  />
                </div>
              </fieldset>

              {/* Botones */}
              <div className="form-actions">
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={onClose}
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="btn btn-primary"
                  disabled={loading}
                  onClick={(e) => {
                    handleSubmit(e);
                    if (onSuccess) {
                      onSuccess();
                    }
                  }}
                >
                  {loading ? 'Guardando...' : 'Guardar CIR'}
                </button>
              </div>
            </form>
          </div>

          {/* Columna derecha: Preview PDF */}
          <div className="preview-section">
            <h4>Vista Previa PDF</h4>
            {loading ? (
              <div className="preview-loading">
                Cargando preview...
              </div>
            ) : previewUrl ? (
              <iframe
                className="preview-iframe"
                src={previewUrl}
                title="PDF Preview"
              />
            ) : (
              <div className="preview-empty">
                Complete el formulario para ver la vista previa
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
