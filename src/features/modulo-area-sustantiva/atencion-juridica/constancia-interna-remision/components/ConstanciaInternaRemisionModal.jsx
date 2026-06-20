import React, { useMemo } from 'react';
import { X, Eye, Download, AlertCircle, CheckCircle } from 'lucide-react';
import { useConstanciaInternaRemision } from '../hooks/useConstanciaInternaRemision';
import './ConstanciaInternaRemisionModal.css';

export const ConstanciaInternaRemisionModal = ({ expedienteId, onClose, onSuccess }) => {
  const {
    formData,
    handleInputChange,
    errors,
    precargados,
    isLoading,
    isGeneratingPreview,
    previewUrl,
    message,
    handleGeneratePreview,
    handleGenerarCIR,
    handleClose,
  } = useConstanciaInternaRemision(expedienteId);

  const isFormValid = useMemo(
    () => Boolean(formData.fundamentos?.trim() && formData.fechaCIR),
    [formData.fundamentos, formData.fechaCIR]
  );

  const handleCancel = () => {
    handleClose();
    onClose?.();
  };

  const handleSave = async () => {
    const success = await handleGenerarCIR();
    if (success) {
      onSuccess?.();
      onClose?.();
    }
  };

  return (
    <div className="cir-modal-overlay" onClick={handleCancel}>
      <div className="cir-modal-container" onClick={(e) => e.stopPropagation()}>
        <div className="cir-modal-header">
          <div>
            <p className="cir-modal-badge">CIR</p>
            <h2>Constancia Interna de Remisión</h2>
            <p className="cir-modal-subtitle">Editor de CIR con preview integrado</p>
          </div>

          <button
            className="cir-btn-close"
            type="button"
            onClick={handleCancel}
            disabled={isLoading}
            aria-label="Cerrar modal"
          >
            <X size={20} />
          </button>
        </div>

        <div className="cir-modal-body">
          <div className="cir-panel">
            {(message?.text || errors.submit || errors.precargados) && (
              <div
                className={`cir-alert ${
                  errors.submit || errors.precargados || message?.type === 'error'
                    ? 'cir-alert-error'
                    : 'cir-alert-success'
                }`}
              >
                {errors.submit || errors.precargados || message?.type === 'error' ? (
                  <AlertCircle size={16} />
                ) : (
                  <CheckCircle size={16} />
                )}
                <span>{errors.submit || errors.precargados || message?.text}</span>
              </div>
            )}

            <div className="cir-section">
              <h3 className="cir-section-title">Información de Remisión</h3>

              <div className="cir-form-group">
                <label className="cir-label">
                  Fundamentos
                  <span className="cir-badge-required">Requerido</span>
                </label>
                <textarea
                  className={`cir-textarea ${errors.fundamentos ? 'cir-error' : ''}`}
                  value={formData.fundamentos}
                  onChange={(e) => handleInputChange('fundamentos', e.target.value)}
                  placeholder="Describe los fundamentos del dictamen..."
                  disabled={isLoading}
                  rows={4}
                />
                {errors.fundamentos && <div className="cir-error-text">{errors.fundamentos}</div>}
              </div>

              <div className="cir-form-group">
                <label className="cir-label">
                  Observaciones
                  <span className="cir-badge-optional">Opcional</span>
                </label>
                <textarea
                  className="cir-textarea"
                  value={formData.observaciones}
                  onChange={(e) => handleInputChange('observaciones', e.target.value)}
                  placeholder="Observaciones adicionales (opcional)..."
                  disabled={isLoading}
                  rows={3}
                />
              </div>

              <div className="cir-form-group">
                <label className="cir-label">
                  Fecha de emisión
                  <span className="cir-badge-required">Requerido</span>
                </label>
                <input
                  type="date"
                  className={`cir-input ${errors.fechaCIR ? 'cir-error' : ''}`}
                  value={formData.fechaCIR}
                  onChange={(e) => handleInputChange('fechaCIR', e.target.value)}
                  disabled={isLoading}
                />
                {errors.fechaCIR && <div className="cir-error-text">{errors.fechaCIR}</div>}
              </div>
            </div>

            <div className="cir-section cir-section-precargados">
              <div className="cir-section-header">
                <h3 className="cir-section-title">Datos precargados</h3>
                <span className="cir-subtext">Solo lectura</span>
              </div>

              {isLoading ? (
                <div className="cir-loading">Cargando datos...</div>
              ) : (
                <div className="cir-precargados-grid">
                  <div className="cir-field-readonly">
                    <label className="cir-label">Asesor que remite</label>
                    <input
                      type="text"
                      className="cir-input cir-readonly"
                      value={precargados.asesorQueRemite}
                      disabled
                    />
                  </div>
                  <div className="cir-field-readonly">
                    <label className="cir-label">Nombre del encargado</label>
                    <input
                      type="text"
                      className="cir-input cir-readonly"
                      value={precargados.nombreEncargado}
                      disabled
                    />
                  </div>
                </div>
              )}
            </div>

            <div className="cir-footer-actions">
              <button
                type="button"
                className="cir-btn cir-btn-secondary"
                onClick={handleCancel}
                disabled={isLoading || isGeneratingPreview}
              >
                Cancelar
              </button>
              <button
                type="button"
                className="cir-btn cir-btn-primary"
                onClick={handleGeneratePreview}
                disabled={!isFormValid || isLoading || isGeneratingPreview}
              >
                <Eye size={16} /> Preview
              </button>
              <button
                type="button"
                className="cir-btn cir-btn-success"
                onClick={handleSave}
                disabled={!isFormValid || isLoading}
              >
                <Download size={16} /> Generar CIR
              </button>
            </div>
          </div>

          <div className="cir-panel cir-panel-preview">
            <div className="cir-preview-header">
              <h3 className="cir-section-title">Vista previa</h3>
              <span className="cir-preview-note">Haz clic en Preview para cargar el documento HTML</span>
            </div>

            {isGeneratingPreview && (
              <div className="cir-loading">Generando preview...</div>
            )}

            {previewUrl ? (
              <iframe
                className="cir-preview-iframe"
                title="Vista previa CIR"
                src={previewUrl}
              />
            ) : (
              <div className="cir-preview-empty">
                Completa los campos requeridos y presiona Preview para visualizar el PDF.
              </div>
            )}

            {errors.preview && (
              <div className="cir-alert cir-alert-error">
                <AlertCircle size={16} />
                <span>{errors.preview}</span>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
