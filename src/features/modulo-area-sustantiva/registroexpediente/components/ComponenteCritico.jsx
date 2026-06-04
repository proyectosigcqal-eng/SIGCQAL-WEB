import React from 'react';

export const ComponenteCritico = ({ onGuardar, isLoading }) => (
  <section className="form-section section-card">
    <div className="section-header">
      <h3 className="section-title">Acción Requerida</h3>
    </div>
    <div className="section-body">
      <div className="componente-critico">
        <div className="componente-critico-content">
          <div className="componente-critico-icon">✓</div>
          <h3 className="componente-critico-title">Guardar expediente y pasar a calificación jurídica</h3>
          <p className="componente-critico-description">Revisa la información y confirma para avanzar. Por ahora solo se prepara el flujo para integración futura.</p>
          <button type="button" className="btn-guardar-expediente" onClick={onGuardar} disabled={isLoading}>
            {isLoading ? (<><span className="spinner-small" /> Guardando...</>) : ('Guardar expediente y pasar a calificación jurídica')}
          </button>
        </div>
      </div>
    </div>
  </section>
);
