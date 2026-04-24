// src/features/modulo-correspondencia/bitacora-historica/components/DetalleEventoModal.jsx
import React from 'react';
import '../styles/bitacora.css';

export const DetalleEventoModal = ({ evento, onClose }) => {
  if (!evento) return null;


  const formatDateTime = (fechaString) => {
    if (!fechaString) return '';
    const date = new Date(fechaString);
    return date.toISOString().slice(0, 16).replace('T', ' '); 
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <h2 className="modal-title">Detalle de Evento</h2>
        
        <div className="modal-grid">
          <div className="form-group">
            <label>Código evento</label>
            <input 
              type="text" 
              readOnly 
              value={`EVT-${evento.idLog.toString().padStart(3, '0')}`} 
            />
          </div>
          <div className="form-group">
            <label>Fecha / Hora</label>
            <input 
              type="text" 
              readOnly 
              value={formatDateTime(evento.fechaMovimiento)} 
            />
          </div>

          <div className="form-group">
            <label>Actor</label>
            <input 
              type="text" 
              readOnly 
              value={evento.nombreUsuario || 'Sistema'} 
            />
          </div>
          <div className="form-group">
            <label>Tipo acción</label>
            <input 
              type="text" 
              readOnly 
              value={`Cambio a estatus: ${evento.nombreEstatusNuevo || 'N/A'}`} 
            />
          </div>

          <div className="form-group full-width">
            <label>Documento vinculado (Asunto)</label>
            <input 
              type="text" 
              readOnly 
              value={evento.asuntoCorrespondencia || 'N/A'} 
            />
          </div>

          <div className="form-group full-width">
            <label>Comentarios / Observaciones</label>
            <textarea 
              readOnly 
              rows="3"
              value={evento.observaciones || 'Sin comentarios adicionales.'} 
            />
          </div>

        
          <div className="form-group full-width">
            <div className="input-with-icon">
                <button className="btn-download" title="Descargar documento">
                </button>
            </div>
          </div>
        </div>

        <div className="modal-actions">
          <button className="btn-aceptar" onClick={onClose}>Aceptar</button>
        </div>
      </div>
    </div>
  );
};