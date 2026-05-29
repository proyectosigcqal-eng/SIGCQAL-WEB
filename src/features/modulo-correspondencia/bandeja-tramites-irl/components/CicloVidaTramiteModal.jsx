import { X } from 'lucide-react';

export default function CicloVidaTramiteModal({ isOpen, onClose, folioId }) {
  if (!isOpen) return null;

  return (
    <div className="irl-modal-overlay" role="dialog" aria-modal="true" aria-label="Ciclo de Vida del trámite">
      <div className="irl-modal">
        <div className="irl-modal-header">
          <h2 className="irl-modal-title">Ciclo de Vida</h2>
          <button type="button" className="irl-icon-btn" onClick={onClose} aria-label="Cerrar">
            <X size={18} />
          </button>
        </div>
        <div className="irl-modal-body">
          <div className="irl-modal-meta">
            <span className="irl-modal-meta-label">Folio</span>
            <span className="irl-modal-meta-value">{folioId || '-'}</span>
          </div>
          <div className="irl-modal-empty">
            Contenido del ciclo de vida pendiente de integración con backend.
          </div>
        </div>
        <div className="irl-modal-footer">
          <button type="button" className="irl-btn irl-btn-secondary" onClick={onClose}>
            Cerrar
          </button>
        </div>
      </div>
    </div>
  );
}
