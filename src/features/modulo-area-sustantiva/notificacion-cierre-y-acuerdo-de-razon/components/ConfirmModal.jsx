import React from 'react';
import '../styles/Modal.css';

const ConfirmModal = ({ onConfirm, onCancel }) => {
  return (
    <div className="modal-overlay">
      <div className="modal-content">
        {/* Icono de advertencia */}
        <div className="modal-icon">⚠️</div>
        
        <h2>¿Confirmar Cierre Total?</h2>
        <p>
          Al finalizar, el expediente quedará bloqueado permanentemente. 
          Esta acción es irreversible y cumple con el cierre legal del proceso.
        </p>

        <div className="modal-actions">
          <button className="btn-confirm" onClick={onConfirm}>
            SÍ, FINALIZAR EXPEDIENTE
          </button>
          <button className="btn-cancel" onClick={onCancel}>
            CANCELAR
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmModal;