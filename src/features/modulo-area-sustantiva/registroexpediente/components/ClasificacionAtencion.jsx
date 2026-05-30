import React from 'react';

export const ClasificacionAtencion = ({ formData, erroresCampo, handleClasificacionChange }) => {
  const opciones = [
    { id: 'asesoria', titulo: 'Asesoría Simplificada', descripcion: 'Orientación básica sobre trámites y obligaciones fiscales' },
    { id: 'queja', titulo: 'Queja Administrativa', descripcion: 'Presentación de quejas ante autoridades fiscales' },
    { id: 'representacion', titulo: 'Representación Legal', descripcion: 'Representación legal completa ante las autoridades' }
  ];

  return (
    <section className="form-section section-card">
      <div className="section-header">
        <h3 className="section-title">Clasificación de Atención</h3>
      </div>
      <div className="section-body">
        {erroresCampo.clasificacionAtencion && <span className="error-text" style={{ display: 'block', marginBottom: '1rem' }}>{erroresCampo.clasificacionAtencion}</span>}
        <div className="clasificacion-grid">
          {opciones.map((opcion) => (
            <div key={opcion.id} className={`clasificacion-card ${formData.clasificacionAtencion === opcion.id ? 'active' : ''}`} onClick={() => handleClasificacionChange(opcion.id)}>
              <div className="card-radio">
                <input type="radio" id={`clasificacion_${opcion.id}`} name="clasificacionAtencion" value={opcion.id} checked={formData.clasificacionAtencion === opcion.id} onChange={() => handleClasificacionChange(opcion.id)} />
              </div>
              <h4 className="card-title">{opcion.titulo}</h4>
              <p className="card-description">{opcion.descripcion}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
