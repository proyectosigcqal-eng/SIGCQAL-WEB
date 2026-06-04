import React from 'react';

export const ModalGuardarExpediente = ({ visible, isLoading, onConfirmar, onCancelar }) => {
  if (!visible) return null;

  return (
    <div className="modal-overlay">
      <div className="modal-content modal-guardar-expediente">
        <div className="modal-header">
          <h2>Confirmar Registro de Expediente</h2>
          <button type="button" className="modal-close" onClick={onCancelar} disabled={isLoading}>×</button>
        </div>
        <div className="modal-body">
          <div className="modal-icon-success">✓</div>
          <p className="modal-message">¿Deseas proceder a guardar este expediente? Una vez guardado, podrás continuar con la calificación jurídica.</p>
        </div>
        <div className="modal-footer">
          <button type="button" className="btn-secundario" onClick={onCancelar} disabled={isLoading}>Cancelar</button>
          <button type="button" className="btn-primario" onClick={onConfirmar} disabled={isLoading}>{isLoading ? (<><span className="spinner-small" /> Guardando...</>) : ('Confirmar y Guardar')}</button>
        </div>
      </div>
    </div>
  );
};
