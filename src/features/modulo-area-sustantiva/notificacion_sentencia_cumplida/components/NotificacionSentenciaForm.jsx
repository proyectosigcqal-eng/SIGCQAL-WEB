import React from 'react';
import '../styles/NotificacionSentenciaForm.css';

const NotificacionSentenciaForm = () => {
  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Formulario de Notificación Sentencia Cumplida enviado");
  };

  return (
    <div className="form-container">
      <form className="sentencia-form" onSubmit={handleSubmit}>
        <h3>Notificación Sentencia Cumplida</h3>
        
        <div className="form-grid">
          {/* ID y Fecha alineados */}
          <div className="field">
            <label htmlFor="id_sentencia_ejecutoria">ID Sentencia Ejecutoria *</label>
            <input type="number" id="id_sentencia_ejecutoria" name="id_sentencia_ejecutoria" required />
          </div>
          <div className="field">
            <label htmlFor="fecha_notificacion_archivo">Fecha Notificación Archivo *</label>
            <input type="date" id="fecha_notificacion_archivo" name="fecha_notificacion_archivo" required />
          </div>

          {/* Oficios */}
          <div className="field">
            <label htmlFor="numero_oficio_cumplimiento">Número de Oficio Cumplimiento *</label>
            <input type="text" id="numero_oficio_cumplimiento" name="numero_oficio_cumplimiento" maxLength="100" required />
          </div>
          <div className="field">
            <label htmlFor="numero_oficio_archivo">Número de Oficio Archivo *</label>
            <input type="text" id="numero_oficio_archivo" name="numero_oficio_archivo" maxLength="100" required />
          </div>

          {/* Observaciones (Gordito) */}
          <div className="field full-width">
            <label htmlFor="observaciones_finales">Observaciones Finales</label>
            <textarea id="observaciones_finales" name="observaciones_finales" rows="6"></textarea>
          </div>
          
          <button type="submit" className="btn-submit">Guardar Notificación</button>
        </div>
      </form>
    </div>
  );
};

export default NotificacionSentenciaForm;