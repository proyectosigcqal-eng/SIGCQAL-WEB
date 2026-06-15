import { useEffect } from 'react';
import { useGenerarConstancia } from '../hooks/useGenerarConstancia';
import './GenerarConstanciaModal.css';

export const GenerarConstanciaModal = ({ expedienteId, onClose, onSuccess }) => {
  const {
    formData,
    handleChange,
    handleGenerarConstancia,
    loading,
    error,
    success,
    resetState,
  } = useGenerarConstancia(expedienteId);

  useEffect(() => {
    if (!success) return undefined;

    const timeoutId = window.setTimeout(() => {
      onSuccess?.();
      resetState();
      onClose?.();
    }, 1500);

    return () => window.clearTimeout(timeoutId);
  }, [onClose, onSuccess, resetState, success]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    await handleGenerarConstancia();
  };

  const handleClose = () => {
    if (loading) return;
    resetState();
    onClose?.();
  };

  return (
    <div className="constancia-modal" role="dialog" aria-modal="true" aria-labelledby="constancia-modal-title">
      <div className="constancia-modal__content">
        <h2 id="constancia-modal-title">Generar Constancia Interna de Remisión</h2>

        {error ? <div className="constancia-alert constancia-alert--error">{error}</div> : null}

        {success ? (
          <div className="constancia-alert constancia-alert--success">
            Constancia generada y descargada correctamente
          </div>
        ) : null}

        <form onSubmit={handleSubmit}>
          <div className="constancia-form-group">
            <label htmlFor="documentacionRemite">Documentación que se remite *</label>
            <textarea
              id="documentacionRemite"
              name="documentacionRemite"
              value={formData.documentacionRemite}
              onChange={handleChange}
              placeholder="Describe la documentación que se adjunta."
              required
              rows={4}
              disabled={loading}
            />
          </div>

          <div className="constancia-form-group">
            <label htmlFor="motivosRemite">Motivos por los que se remite *</label>
            <textarea
              id="motivosRemite"
              name="motivosRemite"
              value={formData.motivosRemite}
              onChange={handleChange}
              placeholder="Explica los motivos de la remisión."
              required
              rows={4}
              disabled={loading}
            />
          </div>

          <div className="constancia-form-group">
            <label htmlFor="observaciones">Observaciones</label>
            <textarea
              id="observaciones"
              name="observaciones"
              value={formData.observaciones}
              onChange={handleChange}
              placeholder="Notas adicionales si es necesario."
              rows={2}
              disabled={loading}
            />
          </div>

          <div className="constancia-form-actions">
            <button
              type="button"
              onClick={handleClose}
              disabled={loading}
              className="constancia-btn constancia-btn--secondary"
            >
              Cancelar
            </button>
            <button type="submit" disabled={loading} className="constancia-btn constancia-btn--primary">
              {loading ? 'Generando...' : 'Generar DOCX'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
